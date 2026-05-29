# PNCP_AUT_3.py — Busca Automática PNCP com Modo Agendado
import sys
import os

# ── Garante que está rodando no Python correto (não o do LibreOffice) ────────
PYTHON_CORRETO = r"C:\Users\Licitacao\AppData\Local\Programs\Python\Python310\python.exe"
if "libreoffice" in sys.executable.lower() or "python-core" in sys.executable.lower():
    import subprocess
    subprocess.Popen([PYTHON_CORRETO] + sys.argv)
    sys.exit(0)
# ─────────────────────────────────────────────────────────────────────────────

import threading
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.service import Service
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException, TimeoutException
from datetime import datetime, timedelta
import time
import ttkbootstrap as tb
from ttkbootstrap.constants import *
from ttkbootstrap.scrolled import ScrolledFrame
import webbrowser
import openpyxl
from openpyxl.styles import Font
from tkinter import filedialog
import os
import requests
from selenium.webdriver.common.action_chains import ActionChains
import tkinter.messagebox as messagebox
import tkinter as tk
from tkinter import ttk
import concurrent.futures
import fitz
import shutil
import hashlib
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# --- CONFIGURAÇÕES DE E-MAIL ---
EMAIL_REMETENTE      = "luandimave@gmail.com"
EMAIL_SENHA_APP      = "idhd wuls yvke muxz"
EMAILS_DESTINATARIOS = ["licitacao@dimave.com.br", "anna@dimave.com.br"]
PASTA_RESULTADO_SERVIDOR = r"Z:\1 -DIMAVE E\PNCP Resultados"

FAKE_KEYWORDS = [
    "Eletrodo Multifuncional","ALFAMED","LIFEPAK","Cmos Drake","Lifemed","Nellcor","BIONET",
    "GLOBALTEC","Instramed","MINDRAY","Medtronic","cardiocare","Covidien","cardiotouch","PNI",
    "Capnografia","Pás Adesivas para Desfibrilador","Pás de Desfibrilação","Braçadeira",
    "Linha de Amostra de Gases","Saturação","Eletrocardiógrafo","Manguito","SENSOR OXIMETRO",
    "SENSOR DE OXIMETRIA","SENSOR SPO2","SENSOR DE SPO2","CABO DE ECG","CABO ECG"
]

driver_global = None
vistos = set()
resultados_gerais = []
resultados_unificados = {}

# ─────────────────────────── AGENDADOR ──────────────────────────────────────
agendador_ativo = False
agendador_thread = None

HORARIOS_AGENDADOS = [
    {"hora": 7,  "minuto": 0,  "periodo": "ontem"},   # 07:00 → dia anterior
    {"hora": 12, "minuto": 0,  "periodo": "hoje"},     # 12:00 → dia atual
]


def calcular_periodo_para_horario(periodo):
    """Retorna (data_inicio, data_fim) conforme o período do horário agendado."""
    hoje = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    if periodo == "ontem":
        ontem = hoje - timedelta(days=1)
        return ontem, ontem
    else:  # "hoje"
        return hoje, hoje


def loop_agendador():
    """Fica em loop verificando se chegou a hora de executar."""
    global agendador_ativo
    ultimo_executado = {}  # chave = "HH:MM", valor = data de última execução

    while agendador_ativo:
        agora = datetime.now()
        chave_atual = agora.strftime("%H:%M")
        data_hoje_str = agora.strftime("%Y-%m-%d")

        for config in HORARIOS_AGENDADOS:
            chave = f"{config['hora']:02d}:{config['minuto']:02d}"
            if (chave_atual == chave and
                    ultimo_executado.get(chave) != data_hoje_str):
                ultimo_executado[chave] = data_hoje_str
                periodo = config["periodo"]
                data_ini, data_fim = calcular_periodo_para_horario(periodo)

                # Atualiza os DateEntry na interface (via after, thread-safe)
                def atualizar_datas(di=data_ini, df=data_fim):
                    data_inicio.entry.delete(0, tk.END)
                    data_inicio.entry.insert(0, di.strftime("%d/%m/%Y"))
                    data_fim.entry.delete(0, tk.END)
                    data_fim.entry.insert(0, df.strftime("%d/%m/%Y"))

                app.after(0, atualizar_datas)

                palavras = entrada_palavras.get("1.0", END).splitlines()
                filtros = {
                    "modalidades": modalidades_var.get(),
                    "orgaos": orgaos_var.get(),
                    "ufs": ufs_var.get(),
                    "municipios": municipios_var.get(),
                    "esferas": esferas_var.get(),
                    "poderes": poderes_var.get(),
                    "tipos": tipos_var.get()
                }

                label_status_agendador.config(
                    text=f"⏱ Executando agendamento {chave} ({periodo})..."
                )
                app.after(0, lambda di=data_ini, df=data_fim, p=palavras, f=filtros: threading.Thread(
                    target=iniciar_pesquisas,
                    args=(p, di, df, log, botao_iniciar, f),
                    daemon=True
                ).start())

        time.sleep(30)  # verifica a cada 30 segundos


def toggle_agendador():
    """Liga ou desliga o agendador."""
    global agendador_ativo, agendador_thread
    if not agendador_ativo:
        agendador_ativo = True
        agendador_thread = threading.Thread(target=loop_agendador, daemon=True)
        agendador_thread.start()
        botao_agendador.config(text="⏹ Parar Agendamento", bootstyle=DANGER)
        label_status_agendador.config(
            text="✅ Agendamento ATIVO  |  07:00 → ontem  |  12:00 → hoje"
        )
    else:
        agendador_ativo = False
        botao_agendador.config(text="⏰ Iniciar Agendamento", bootstyle=WARNING)
        label_status_agendador.config(text="⏸ Agendamento parado.")


# ─────────────────────────── UTILITÁRIOS ────────────────────────────────────
def sanitize_filename(text):
    return re.sub(r'[\\/*?:"<>|]', "_", text)


def converter_data(texto_data):
    return datetime.strptime(texto_data, "%d/%m/%Y")


def data_no_periodo(data_edital, data_inicio, data_fim):
    return data_inicio <= data_edital <= data_fim


def abrir_link_callback(link, botao, texto_label):
    webbrowser.open(link)
    vistos.add(link)
    botao.config(text="Abrir novamente", bootstyle=SECONDARY)
    texto_label.config(foreground="gray")


# ─────────────────────────── INTERFACE: RESULTADOS ──────────────────────────
def exibir_resultados_na_interface(resultados, palavra_chave, container):
    """Exibe palavras 'mascaradas' (FAKE_KEYWORDS) na interface."""
    global resultados_unificados

    for texto, link in resultados:
        if link in resultados_unificados:
            if palavra_chave not in resultados_unificados[link]['palavras_reais']:
                resultados_unificados[link]['palavras_reais'].append(palavra_chave)
            continue
        resultados_unificados[link] = {
            'texto': texto,
            'palavras_reais': [palavra_chave],
        }

    # Limpa o container
    for widget in container.winfo_children():
        widget.destroy()

    def escolher_fake_keywords(link, max_count=4):
        h = hashlib.sha256(link.encode('utf-8')).hexdigest()
        nums = [int(h[i:i+8], 16) for i in range(0, min(len(h), 8*4), 8)]
        selecionadas = []
        for n in nums:
            idx = n % len(FAKE_KEYWORDS)
            kw = FAKE_KEYWORDS[idx]
            if kw not in selecionadas:
                selecionadas.append(kw)
            if len(selecionadas) >= max_count:
                break
        return selecionadas

    for link, dados in list(resultados_unificados.items()):
        texto = dados['texto']
        palavras_reais = dados.get('palavras_reais', [])

        fake_sel = escolher_fake_keywords(link, max_count=4)
        palavras_para_exibir = fake_sel

        titulo = tb.Label(
            container,
            text=f"\nResultado: {', '.join(palavras_para_exibir)}",
            font=('Helvetica', 12, 'bold')
        )
        titulo.pack(anchor='w', pady=(10, 0))

        frame_resultado = tb.Frame(container)
        frame_resultado.pack(fill=X, pady=5, padx=10, anchor='w')

        label_texto = tb.Label(frame_resultado, text=texto, justify=LEFT, wraplength=550)
        label_texto.pack(side=LEFT, expand=True, fill=X)

        if link in vistos:
            btn_abrir = tb.Button(frame_resultado, text="Abrir novamente", bootstyle=SECONDARY)
            label_texto.config(foreground="gray")
        else:
            btn_abrir = tb.Button(frame_resultado, text="Abrir", bootstyle=INFO)

        btn_abrir.config(command=lambda l=link, b=btn_abrir, t=label_texto: abrir_link_callback(l, b, t))
        btn_abrir.pack(side=RIGHT, padx=5)

        btn_baixar = tb.Button(frame_resultado, text="Baixar", bootstyle=PRIMARY)
        btn_baixar.config(command=lambda l=link, t=texto, b=btn_baixar, lbl=label_texto: threading.Thread(
            target=baixar_arquivos_edital,
            args=(l, t, log, b, lbl),
            daemon=True
        ).start())
        btn_baixar.pack(side=RIGHT, padx=5)

        btn_executar = tb.Button(frame_resultado, text="Executar", bootstyle=SUCCESS)

        def ao_executar(l=link, t=texto, b=btn_executar):
            if not hasattr(b, "executado"):
                b.executado = False
            if not b.executado:
                threading.Thread(target=executar_fluxo_completo, args=(l, t, log), daemon=True).start()
                b.executado = True
                b.config(bootstyle=SECONDARY, text="Executado (⇨ Local)")
            else:
                threading.Thread(target=executar_processamento_local, daemon=True).start()

        btn_executar.config(command=lambda l=link, t=texto, b=btn_executar: ao_executar(l, t, b))
        btn_executar.pack(side=RIGHT, padx=5)

        resultados_gerais.append({
            "palavra_chave": ', '.join(palavras_reais),
            "texto": texto,
            "link": link,
            "visto": "Sim" if link in vistos else "Não"
        })


# ─────────────────────────── E-MAIL ─────────────────────────────────────────
def enviar_email_pncp(resultados_unificados):
    """Envia e-mail avisando que os arquivos foram salvos na pasta do servidor."""
    try:
        num = len(resultados_unificados)
        msg = MIMEMultipart()
        msg['From']    = EMAIL_REMETENTE
        msg['To']      = ", ".join(EMAILS_DESTINATARIOS)
        msg['Subject'] = f"[PNCP] Pesquisa Automática - {num} Edital(is) encontrado(s)"

        linhas = []
        for i, (link, dados) in enumerate(resultados_unificados.items(), 1):
            palavras = ", ".join(dados.get('palavras_reais', []))
            texto_resumo = dados.get('texto', '')[:120].replace('\n', ' ')
            linhas.append(f"{i}. {texto_resumo}\n   Palavras: {palavras}\n   Link: {link}\n")

        corpo = (
            f"Pesquisa automática PNCP concluída em {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}.\n\n"
            f"Foram encontrados {num} edital(is) com palavras-chave de interesse.\n\n"
            f"📁 Os arquivos foram salvos na pasta do servidor:\n"
            f"   {PASTA_RESULTADO_SERVIDOR}\n\n"
            f"{'='*60}\n"
            f"RESUMO DOS EDITAIS ENCONTRADOS:\n"
            f"{'='*60}\n\n"
            + ("\n".join(linhas) if linhas else "Nenhum detalhe disponível.")
        )
        msg.attach(MIMEText(corpo, 'plain', 'utf-8'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_REMETENTE, EMAIL_SENHA_APP)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"[!] Erro ao enviar e-mail PNCP: {e}")
        return False


# ─────────────────────────── FLUXO COMPLETO ─────────────────────────────────
def executar_fluxo_completo(link_edital, texto_edital, log_output):
    import os, time, traceback, zipfile, tarfile
    from selenium.webdriver.firefox.options import Options as FirefoxOptions
    from selenium.webdriver.firefox.service import Service as FirefoxService

    try:
        import rarfile
    except ImportError:
        rarfile = None

    def log_print(msg):
        log_output.insert("end", msg + "\n")
        log_output.see("end")

    def sanitize_fn(text):
        return re.sub(r'[\\/*?:"<>|]', "_", text)

    def extrair_arquivo(caminho):
        try:
            destino = os.path.dirname(caminho)
            if caminho.endswith(".zip"):
                with zipfile.ZipFile(caminho, 'r') as zip_ref:
                    for member in zip_ref.infolist():
                        if not member.is_dir():
                            member.filename = os.path.basename(member.filename)
                            zip_ref.extract(member, destino)
            elif caminho.endswith(".rar") and rarfile:
                with rarfile.RarFile(caminho, 'r') as rar_ref:
                    for member in rar_ref.infolist():
                        if member.filename and not member.is_directory():
                            with rar_ref.open(member) as source, open(
                                os.path.join(destino, os.path.basename(member.filename)), "wb"
                            ) as target:
                                target.write(source.read())
            elif caminho.endswith(".tar") or caminho.endswith(".tar.gz"):
                with tarfile.open(caminho, 'r:*') as tar_ref:
                    for member in tar_ref.getmembers():
                        if member.isfile():
                            member.name = os.path.basename(member.name)
                            tar_ref.extract(member, destino)
            log_print(f"📦 Extraído: {os.path.basename(caminho)}")
        except Exception as e:
            log_print(f"❌ Erro ao extrair {os.path.basename(caminho)}: {e}")

    def aguardar_downloads_concluidos(pasta, timeout=60):
        log_print("⌛ Aguardando finalização dos downloads...")
        tempo_inicial = time.time()
        while True:
            arquivos_part = [f for f in os.listdir(pasta) if f.endswith(".part")]
            if not arquivos_part:
                return True
            if time.time() - tempo_inicial > timeout:
                log_print("⚠️ Tempo limite atingido ao aguardar downloads.")
                return False
            time.sleep(1)

    while True:
        try:
            log_print("🧠 Iniciando execução do fluxo completo...")
            pasta_download = PASTA_RESULTADO_SERVIDOR
            os.makedirs(pasta_download, exist_ok=True)

            options = FirefoxOptions()
            options.add_argument("--headless")
            options.binary_location = r"C:\Program Files\Mozilla Firefox\firefox.exe"
            options.set_preference("browser.download.folderList", 2)
            options.set_preference("browser.download.dir", pasta_download)
            options.set_preference("browser.helperApps.neverAsk.saveToDisk",
                                   "application/pdf, application/zip, application/x-rar-compressed, application/octet-stream")
            options.set_preference("pdfjs.disabled", True)

            driver = webdriver.Firefox(
                service=FirefoxService("C:/Drivers/geckodriver/geckodriver.exe"),
                options=options
            )
            wait = WebDriverWait(driver, 30)

            log_print(f"🌐 Acessando edital: {link_edital}")
            driver.get(link_edital)
            aba_arquivos = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//span[text()='Arquivos']/parent::button")))
            aba_arquivos.click()
            time.sleep(2)

            botoes_download = wait.until(EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, "a.br-button.circle[href*='/arquivos/']")))
            nomes_arquivos = []

            for i, botao in enumerate(botoes_download, 1):
                try:
                    href = botao.get_attribute("href")
                    nome_url = href.split("/")[-1].split("?")[0]
                    ext = nome_url.split(".")[-1] if "." in nome_url else "pdf"
                    nome_arquivo = f"{sanitize_fn(texto_edital[:30])}_arquivo_{i}.{ext}"
                    nomes_arquivos.append(nome_arquivo)
                    log_print(f"⬇️ Baixando arquivo {i}: {nome_arquivo}")
                    driver.execute_script("arguments[0].click();", botao)
                    time.sleep(1)
                except Exception as e:
                    log_print(f"⚠️ Erro ao tentar baixar arquivo {i}: {e}")

            driver.quit()
            aguardar_downloads_concluidos(pasta_download)

            for nome in nomes_arquivos:
                caminho = os.path.join(pasta_download, nome)
                if os.path.exists(caminho) and caminho.lower().endswith(('.zip', '.rar', '.tar', '.tar.gz')):
                    extrair_arquivo(caminho)

            log_print("✅ Downloads e extrações concluídos. Iniciando processamento local...")
            executar_processamento_local()
            break

        except Exception as e:
            log_print("❌ Erro no fluxo. Reiniciando...")
            import traceback
            traceback.print_exc()
            time.sleep(2)


# ─────────────────────────── EXPORTAR EXCEL ─────────────────────────────────
def exportar_para_excel():
    if not resultados_gerais:
        tb.messagebox.showinfo("Exportar", "Nenhum resultado para exportar.")
        return

    arquivo = filedialog.asksaveasfilename(
        defaultextension=".xlsx",
        filetypes=[("Planilhas Excel", "*.xlsx")],
        title="Salvar como"
    )
    if not arquivo:
        return

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Editais"

    cabecalhos = [
        "Palavra-chave", "Edital nº", "Id PNCP", "Modalidade",
        "Última Atualização", "Órgão", "Local", "Objeto",
        "Link", "Visto"
    ]
    ws.append(cabecalhos)
    for cell in ws[1]:
        cell.font = Font(bold=True)

    for item in resultados_gerais:
        texto_splitado = [parte.strip() for parte in item["texto"].split("|")]
        dados = {chave: "" for chave in cabecalhos[1:-2]}

        for campo in texto_splitado:
            if campo.startswith("Edital"):
                dados["Edital nº"] = campo
            elif campo.startswith("Id contratação"):
                dados["Id PNCP"] = campo.replace("Id contratação PNCP:", "").strip()
            elif campo.startswith("Modalidade"):
                dados["Modalidade"] = campo.replace("Modalidade da Contratação:", "").strip()
            elif campo.startswith("Última Atualização"):
                dados["Última Atualização"] = campo.replace("Última Atualização:", "").strip()
            elif campo.startswith("Órgão"):
                dados["Órgão"] = campo.replace("Órgão:", "").strip()
            elif campo.startswith("Local"):
                dados["Local"] = campo.replace("Local:", "").strip()
            elif campo.startswith("Objeto"):
                dados["Objeto"] = campo.replace("Objeto:", "").strip()

        ws.append([
            item["palavra_chave"],
            dados["Edital nº"], dados["Id PNCP"], dados["Modalidade"],
            dados["Última Atualização"], dados["Órgão"], dados["Local"], dados["Objeto"],
            item["link"], item["visto"]
        ])

    wb.save(arquivo)
    tb.messagebox.showinfo("Exportação concluída", f"Arquivo salvo com sucesso:\n{arquivo}")


# ─────────────────────────── INICIAR PESQUISAS ──────────────────────────────
def iniciar_pesquisas(lista_palavras, data_inicio_val, data_fim_val, log_widget, botao_ini, filtros):

    palavras = [palavra.strip() for palavra in lista_palavras if palavra.strip()]

    if not palavras:
        app.after(0, lambda: log_widget.insert(END, "⚠️ Nenhuma palavra-chave informada!\n"))
        app.after(0, lambda: log_widget.see(END))
        return

    # Atualizações de UI devem ir via app.after (thread-safe)
    app.after(0, lambda: botao_ini.config(state=DISABLED))

    resultados_gerais.clear()
    global resultados_unificados
    resultados_unificados = {}

    app.after(0, lambda: [w.destroy() for w in resultados_container.winfo_children()])
    app.after(0, lambda: log_widget.delete("1.0", END))
    app.after(0, lambda: log_widget.insert(END,
        f"🔍 Iniciando busca de {len(palavras)} palavra(s) — "
        f"{data_inicio_val.strftime('%d/%m/%Y')} a {data_fim_val.strftime('%d/%m/%Y')}\n"))
    app.after(0, lambda: log_widget.see(END))

    def executar_em_paralelo_limitado():
        from concurrent.futures import ThreadPoolExecutor, wait as fut_wait
        sem_ocr_pastas = []

        def log(msg):
            app.after(0, lambda m=msg: log_widget.insert(END, m + "\n"))
            app.after(0, lambda: log_widget.see(END))

        log(f"▶ Executando buscas em paralelo (máx 2 threads)...")

        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = {executor.submit(
                executar_busca, palavra, data_inicio_val, data_fim_val, log_widget, filtros
            ): palavra for palavra in palavras}
            for future in futures:
                palavra = futures[future]
                try:
                    future.result()
                except Exception as e:
                    log(f"❌ Erro na busca de '{palavra}': {e}")

        # Pesquisa Automática
        if pesquisa_automatica_var.get():
            log("\n⚡ Pesquisa Automática: baixando todos os editais...")
            for link, dados in list(resultados_unificados.items()):
                texto = dados['texto']
                try:
                    pasta = baixar_arquivos_edital(link, texto, log_widget)
                    if pasta and os.path.isdir(pasta):
                        status = processar_pasta_edital(pasta, palavras)
                        if status == "sem_ocr":
                            sem_ocr_pastas.append(pasta)
                except Exception as e:
                    log(f"❌ Erro ao baixar automaticamente: {e}")

            if sem_ocr_pastas:
                try:
                    with open(os.path.join(PASTA_RESULTADO_SERVIDOR, "pastas_sem_OCR.txt"), "w", encoding="utf-8") as f:
                        f.write("\n".join(sem_ocr_pastas))
                    log("⚠️ Pastas sem OCR listadas em pastas_sem_OCR.txt")
                except Exception:
                    pass

        log("\n✅ Todas as buscas finalizadas!")

        if resultados_unificados:
            log("📧 Enviando e-mail de notificação...")
            ok = enviar_email_pncp(resultados_unificados)
            if ok:
                log(f"✅ E-mail enviado para: {', '.join(EMAILS_DESTINATARIOS)}")
            else:
                log("⚠️ Falha ao enviar e-mail.")
        else:
            log("ℹ️ Nenhum resultado encontrado no período informado.")

        app.after(0, lambda: botao_ini.config(state=NORMAL))
        if agendador_ativo:
            app.after(0, lambda: label_status_agendador.config(
                text="✅ Agendamento ATIVO  |  07:00 → ontem  |  12:00 → hoje"
            ))

    threading.Thread(target=executar_em_paralelo_limitado, daemon=True).start()


# ─────────────────────────── BAIXAR ARQUIVOS ────────────────────────────────
def baixar_arquivos_edital(link_edital, texto_edital, log_output, botao=None, texto_label=None):
    import urllib.parse

    log_output.insert(END, "🔍 Acessando edital para baixar arquivos...\n")
    log_output.see(END)

    options = webdriver.FirefoxOptions()
    options.add_argument("--headless")
    options.binary_location = "C:/Program Files/Mozilla Firefox/firefox.exe"

    driver = webdriver.Firefox(
        service=Service("C:/Drivers/geckodriver/geckodriver.exe"),
        options=options
    )
    wait = WebDriverWait(driver, 15)

    try:
        driver.get(link_edital)
        aba_arquivos = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//span[contains(text(),'Arquivos')]/parent::button")))
        aba_arquivos.click()

        botoes_download = wait.until(EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "a.br-button.circle[href*='/arquivos/']")))

        urls = []
        for i, botao_site in enumerate(botoes_download, 1):
            url_arquivo = botao_site.get_attribute("href")
            nome_url = url_arquivo.split("/")[-1].split("?")[0]
            ext = nome_url.split(".")[-1] if "." in nome_url else "pdf"
            nome_arquivo = f"arquivo_{i}.{ext}"
            urls.append((url_arquivo, nome_arquivo))

        pasta_base = PASTA_RESULTADO_SERVIDOR
        nome_pasta = sanitize_filename(texto_edital[:50]).strip()
        pasta_edital = os.path.join(pasta_base, nome_pasta)
        os.makedirs(pasta_edital, exist_ok=True)

        def baixar_arquivo(url, nome_arquivo):
            os.makedirs(pasta_edital, exist_ok=True)
            caminho = os.path.join(pasta_edital, nome_arquivo)
            try:
                resposta = requests.get(url, stream=True, timeout=30)
                if resposta.status_code == 200:
                    with open(caminho, "wb") as f:
                        for chunk in resposta.iter_content(chunk_size=8192):
                            if chunk:
                                f.write(chunk)
                    log_output.insert(END, f"✅ Sucesso: {nome_arquivo}\n")
                else:
                    log_output.insert(END, f"❌ Falha ({resposta.status_code}): {nome_arquivo}\n")
            except Exception as e:
                log_output.insert(END, f"❌ Erro ao baixar {nome_arquivo}: {e}\n")
            log_output.see(END)

        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = [executor.submit(baixar_arquivo, url, nome) for url, nome in urls]
            concurrent.futures.wait(futures)

        log_output.insert(END, f"\n📁 Arquivos salvos em: {pasta_edital}\n\n")
        log_output.see(END)

        if botao is not None:
            botao.config(text="Baixar novamente", bootstyle=SECONDARY)
        if texto_label is not None:
            texto_label.config(foreground="gray")

        return pasta_edital

    except Exception as e:
        log_output.insert(END, f"❌ Erro geral ao tentar baixar: {e}\n")
        log_output.see(END)
        return None
    finally:
        driver.quit()


# ─────────────────────────── EXECUTAR BUSCA ─────────────────────────────────
def executar_busca(palavra_chave, data_inicio_val, data_fim_val, container_log, filtros):
    from selenium.common.exceptions import TimeoutException

    def log(msg):
        app.after(0, lambda m=msg: container_log.insert(END, m + "\n"))
        app.after(0, lambda: container_log.see(END))

    options = webdriver.FirefoxOptions()
    options.add_argument("--headless")
    options.binary_location = "C:/Program Files/Mozilla Firefox/firefox.exe"

    try:
        driver = webdriver.Firefox(
            service=Service("C:/Drivers/geckodriver/geckodriver.exe"),
            options=options
        )
    except Exception as e:
        log(f"[{palavra_chave}] ❌ Falha ao iniciar Firefox: {e}")
        return

    wait = WebDriverWait(driver, 20)

    try:
        log(f"[{palavra_chave}] 🌐 Acessando PNCP...")
        driver.get("https://pncp.gov.br/app/editais?q=&status=recebendo_proposta&pagina=1")

        campo_busca = wait.until(EC.presence_of_element_located((By.ID, "keyword")))
        campo_busca.clear()
        campo_busca.send_keys(palavra_chave)
        log(f"[{palavra_chave}] 🔑 Palavra digitada no campo de busca.")

        def aplicar_filtro(id_html, valor):
            if valor and valor != "Não filtrar":
                try:
                    seletor = wait.until(EC.element_to_be_clickable(
                        (By.CSS_SELECTOR, f"ng-select#{id_html} .ng-select-container")))
                    seletor.click()
                    time.sleep(0.5)
                    opcao = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, f"//div[@role='option' and contains(., '{valor}')]")))
                    opcao.click()
                except Exception:
                    log(f"[{palavra_chave}] ⚠️ Filtro não aplicado: {id_html}={valor}")

        aplicar_filtro("modalidades", filtros.get("modalidades"))
        aplicar_filtro("orgaos",      filtros.get("orgaos"))
        aplicar_filtro("ufs",         filtros.get("ufs"))
        aplicar_filtro("municipios",  filtros.get("municipios"))
        aplicar_filtro("esferas",     filtros.get("esferas"))
        aplicar_filtro("poderes",     filtros.get("poderes"))
        aplicar_filtro("tipos",       filtros.get("tipos"))

        log(f"[{palavra_chave}] 🔎 Clicando em Pesquisar...")
        botao_buscar = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(@class, 'br-button primary') and .//span[text()='Pesquisar']]")))
        botao_buscar.click()

        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'pncp-items-list')))
            log(f"[{palavra_chave}] ✅ Lista de editais carregada.")
        except TimeoutException:
            log(f"[{palavra_chave}] ⚠️ Lista de editais não carregou. Encerrando.")
            return

        try:
            seletor_dropdown = wait.until(EC.element_to_be_clickable(
                (By.CSS_SELECTOR, 'ng-select#tam_pagina .ng-select-container')))
            seletor_dropdown.click()
            time.sleep(0.5)
            opcao_100 = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//div[@role='option' and contains(., '100')]")))
            opcao_100.click()
            time.sleep(1)
        except Exception:
            log(f"[{palavra_chave}] ⚠️ Não foi possível mudar para 100 por página.")

        resultados_periodo = []
        pagina = 1
        parar = False

        while not parar:
            log(f"[{palavra_chave}] 📄 Lendo página {pagina}...")

            try:
                editais = wait.until(EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, 'pncp-items-list a.br-item[href^="/editais/"]')))
            except TimeoutException:
                log(f"[{palavra_chave}] ⚠️ Nenhum edital na página {pagina}.")
                break

            log(f"[{palavra_chave}] 📋 {len(editais)} edital(is) encontrado(s) na página {pagina}.")

            for edital in editais:
                texto_edital = edital.text
                link_edital  = edital.get_attribute('href')

                data_atualizacao = next(
                    (linha.split("Última Atualização:")[-1].strip()
                     for linha in texto_edital.split('\n') if "Última Atualização:" in linha),
                    ""
                )
                if not data_atualizacao:
                    continue
                try:
                    data_edital = converter_data(data_atualizacao)
                except Exception:
                    continue

                if data_no_periodo(data_edital, data_inicio_val, data_fim_val):
                    if not link_edital.startswith("http"):
                        link_edital = "https://pncp.gov.br" + link_edital
                    resultados_periodo.append((texto_edital.replace("\n", " | "), link_edital))
                elif data_edital < data_inicio_val:
                    parar = True
                    break

            if parar:
                break

            try:
                botao_proxima_pagina = wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//button[@data-next-page and not(@disabled)]")))
                botao_proxima_pagina.click()
                pagina += 1
            except Exception:
                break

        log(f"[{palavra_chave}] 🏁 Total no período: {len(resultados_periodo)} resultado(s).")

        if resultados_periodo:
            # Exibir na interface SEMPRE via app.after (thread-safe)
            app.after(0, lambda r=resultados_periodo, p=palavra_chave: exibir_resultados_na_interface(r, p, resultados_container))
        else:
            log(f"[{palavra_chave}] ℹ️ Nenhum resultado no período informado.")

    except Exception as e:
        import traceback
        log(f"[{palavra_chave}] ❌ Erro inesperado: {e}")
        log(traceback.format_exc())
    finally:
        try:
            driver.quit()
        except Exception:
            pass


# ─────────────────────────── PROCESSAMENTO LOCAL ────────────────────────────
def executar_processamento_local():
    import unicodedata

    pasta_download = PASTA_RESULTADO_SERVIDOR
    palavras_chave = [
        'Eletrodo Multifuncional', 'ALFAMED', 'LIFEPAK', 'Cmos', 'Zoll', 'Lifemed', 'Nellcor',
        'BIONET', 'GLOBALTEC', 'TORACIC', 'MINDRAY', 'Medtronic', 'cardiocare', 'Covidien',
        'cardiotouch', 'AMOSTRAGEM', 'PNI', 'WATERLOCK', 'LUER LOCK', 'Capnografia',
        'Pás Adesivas para Desfibrilador', 'Pás de Desfibrilação', 'Esofágico', 'Pás de DEA',
        'Oximetr', 'Retal', 'Linha de Amostra de Gases', 'Braçadeira', 'Philips', 'Saturação',
        'Eletrocardiógrafo', 'Manguito', 'Rabicho', 'ECG'
    ]
    portais = {
        'PORTALDECOMPRASPUBLICAS': 'PORTAL DE COMPRAS PUBLICAS',
        'COMPRASNET': 'COMPRASNET',
        'LICITACOES-E': 'LICITAÇÕES-E',
        'BLL': 'BLL',
        'LICITANET': 'LICITANET',
        'BNC': 'BNC',
        'COMPRASMG': 'COMPRAS MG',
        'PE-INTEGRADO': 'PE-INTEGRADO'
    }

    def normalizar(texto):
        texto = unicodedata.normalize('NFD', texto.lower())
        texto = texto.encode('ascii', 'ignore').decode('utf-8')
        texto = re.sub(r'[\s\-_]+', ' ', texto)
        return texto.strip()

    resultados = []

    for nome_arquivo in os.listdir(pasta_download):
        if not nome_arquivo.lower().endswith('.pdf'):
            continue
        caminho = os.path.join(pasta_download, nome_arquivo)
        for _ in range(10):
            if os.path.getsize(caminho) > 1024:
                break
            time.sleep(1)
        else:
            resultados.append(f"⏳ Arquivo ignorado (vazio): {nome_arquivo}")
            continue

        try:
            doc = fitz.open(caminho)
            texto = "".join(pagina.get_text() for pagina in doc)
            doc.close()
            texto_n = normalizar(texto)

            palavras_encontradas = [p for p in palavras_chave if normalizar(p) in texto_n]

            portal_detectado = "Não identificado"
            texto_portal = texto_n.replace(" ", "")
            for chave, nome_formatado in portais.items():
                if chave.lower().replace("-", "").replace("_", "") in texto_portal:
                    portal_detectado = f"({nome_formatado})"
                    break

            if palavras_encontradas:
                resultados.append(
                    f"📄 {nome_arquivo}\n🔍 Palavras-chave: {', '.join(palavras_encontradas)}\n🌐 Portal: {portal_detectado}"
                )
            else:
                resultados.append(f"📄 {nome_arquivo}\n⚠️ Nenhuma palavra-chave encontrada.")
        except Exception as e:
            resultados.append(f"❌ Erro ao processar {nome_arquivo}: {e}")

    popup = tk.Toplevel()
    popup.title("Resultado do Processamento Local")
    popup.geometry("700x600")
    texto_widget = tk.Text(popup, wrap="word")
    texto_widget.insert("1.0", "\n\n".join(resultados) if resultados else "Nenhum resultado encontrado.")
    texto_widget.config(state="normal")
    texto_widget.pack(expand=True, fill="both", padx=10, pady=10)

    def copiar():
        popup.clipboard_clear()
        popup.clipboard_append(texto_widget.get("1.0", "end-1c"))
        popup.update()

    tk.Button(popup, text="Copiar Resultado", command=copiar).pack(pady=5)
    tk.Button(popup, text="Fechar", command=popup.destroy).pack(pady=5)


def processar_pasta_edital(pasta_edital, palavras_chave):
    palavras_encontradas_globais = set()
    somente_sem_ocr = True

    for nome_arquivo in os.listdir(pasta_edital):
        if not nome_arquivo.lower().endswith('.pdf'):
            continue
        caminho = os.path.join(pasta_edital, nome_arquivo)
        try:
            doc = fitz.open(caminho)
            texto = "".join(pagina.get_text() for pagina in doc)
            doc.close()
            if texto.strip():
                somente_sem_ocr = False
                for palavra in palavras_chave:
                    if palavra.lower() in texto.lower():
                        palavras_encontradas_globais.add(palavra)
        except Exception:
            continue

    if palavras_encontradas_globais:
        with open(os.path.join(pasta_edital, "resultado.txt"), "w", encoding="utf-8") as f:
            f.write("Palavras-chave encontradas:\n")
            f.write("\n".join(sorted(palavras_encontradas_globais)))
        return "com_palavras"

    if somente_sem_ocr:
        return "sem_ocr"

    shutil.rmtree(pasta_edital, ignore_errors=True)
    return "sem_resultado"


# ════════════════════════════════════════════════════════════════════════════
#                          INTERFACE GRÁFICA (criada primeiro, oculta)
# ════════════════════════════════════════════════════════════════════════════
app = tb.Window(themename="cosmo")
app.title("Busca Automática PNCP")
app.geometry("960x980")
app.minsize(800, 700)
app.withdraw()   # fica oculto até a senha ser validada

# ════════════════════════════════════════════════════════════════════════════
#                          TELA DE SENHA (Toplevel sobre o app)
# ════════════════════════════════════════════════════════════════════════════
_SENHA_CORRETA = hashlib.sha256("Baloo@17".encode()).hexdigest()


def tela_senha():
    login = tk.Toplevel(app)
    login.title("PNCP — Acesso Restrito")
    login.resizable(False, False)
    login.configure(bg="#f0f0f0")
    login.grab_set()  # bloqueia interação com o app enquanto login estiver aberto

    lw, lh = 380, 260
    login.update_idletasks()
    x = (login.winfo_screenwidth()  // 2) - (lw // 2)
    y = (login.winfo_screenheight() // 2) - (lh // 2)
    login.geometry(f"{lw}x{lh}+{x}+{y}")

    frame = tk.Frame(login, bg="#f0f0f0", padx=30, pady=20)
    frame.pack(fill="both", expand=True)

    tk.Label(frame, text="🔒 Busca Automática PNCP",
             font=("Helvetica", 14, "bold"), bg="#f0f0f0").pack(pady=(0, 5))
    tk.Label(frame, text="Digite a senha para continuar:",
             font=("Helvetica", 10), bg="#f0f0f0").pack(pady=(0, 12))

    entrada_senha = tk.Entry(frame, show="●", font=("Helvetica", 12), width=24,
                             relief="solid", bd=1)
    entrada_senha.pack(pady=(0, 5), ipady=4)
    entrada_senha.focus()

    label_erro = tk.Label(frame, text="", fg="#e74c3c",
                          font=("Helvetica", 9), bg="#f0f0f0")
    label_erro.pack(pady=(0, 10))

    tentativas = {"n": 0}

    def verificar(event=None):
        hash_digitada = hashlib.sha256(entrada_senha.get().encode()).hexdigest()
        if hash_digitada == _SENHA_CORRETA:
            login.destroy()
            app.deiconify()   # revela o app principal
        else:
            tentativas["n"] += 1
            entrada_senha.delete(0, "end")
            label_erro.config(text=f"❌ Senha incorreta. (tentativa {tentativas['n']})")
            entrada_senha.focus()

    def fechar():
        app.destroy()   # encerra tudo se fechar o login

    tk.Button(frame, text="  Entrar  ", font=("Helvetica", 11),
              bg="#2ecc71", fg="white", relief="flat",
              activebackground="#27ae60", activeforeground="white",
              cursor="hand2", command=verificar).pack(pady=(0, 5))

    entrada_senha.bind("<Return>", verificar)
    login.protocol("WM_DELETE_WINDOW", fechar)


tela_senha()

# Canvas + Scrollbar externo para rolar toda a interface
canvas_main = tk.Canvas(app, borderwidth=0, highlightthickness=0)
scrollbar_main = tk.Scrollbar(app, orient="vertical", command=canvas_main.yview)
canvas_main.configure(yscrollcommand=scrollbar_main.set)

scrollbar_main.pack(side=RIGHT, fill=Y)
canvas_main.pack(side=LEFT, fill=BOTH, expand=True)

frame_principal = tk.Frame(canvas_main)
canvas_window = canvas_main.create_window((0, 0), window=frame_principal, anchor="nw")

# padding interno via configure após criação
frame_principal.configure(padx=20, pady=10)


def _on_frame_configure(event):
    canvas_main.configure(scrollregion=canvas_main.bbox("all"))


def _on_canvas_configure(event):
    canvas_main.itemconfig(canvas_window, width=event.width)


frame_principal.bind("<Configure>", _on_frame_configure)
canvas_main.bind("<Configure>", _on_canvas_configure)

# Scroll com mouse
def _on_mousewheel(event):
    canvas_main.yview_scroll(int(-1 * (event.delta / 120)), "units")

canvas_main.bind_all("<MouseWheel>", _on_mousewheel)

# ── Palavras-chave ───────────────────────────────────────────────────────────
tb.Label(frame_principal, text="Palavras-chave (uma por linha):",
         font=('Helvetica', 12)).pack(anchor=W)
entrada_palavras = tb.Text(frame_principal, height=6)
entrada_palavras.pack(fill=X, pady=5)

# ── Datas ────────────────────────────────────────────────────────────────────
frame_datas = tb.Frame(frame_principal)
frame_datas.pack(fill=X, pady=5)
tb.Label(frame_datas, text="Data início:").pack(side=LEFT, padx=(0, 5))
data_inicio = tb.DateEntry(frame_datas, bootstyle="info", dateformat='%d/%m/%Y',
                           startdate=datetime.now())
data_inicio.pack(side=LEFT, padx=5)
tb.Label(frame_datas, text="Data fim:").pack(side=LEFT, padx=(10, 5))
data_fim = tb.DateEntry(frame_datas, bootstyle="info", dateformat='%d/%m/%Y',
                        startdate=datetime.now())
data_fim.pack(side=LEFT, padx=5)

# ── Filtros Avançados ────────────────────────────────────────────────────────
frame_filtros = tb.LabelFrame(frame_principal, text="Filtros Avançados")
frame_filtros.pack(fill=X, pady=10, ipadx=5, ipady=5)


def combo(label, row, col, values):
    tb.Label(frame_filtros, text=label).grid(row=row, column=col * 2, sticky=W, padx=5, pady=2)
    var = tb.StringVar(value="Não filtrar")
    cb = tb.Combobox(frame_filtros, textvariable=var,
                     values=["Não filtrar"] + values, state="readonly", width=22)
    cb.grid(row=row, column=col * 2 + 1, padx=5, pady=2, sticky=W)
    return var


modalidades_var = combo("Modalidades:", 0, 0, ["Concorrência", "Pregão", "Dispensa", "Inexigibilidade"])
orgaos_var      = combo("Órgãos:", 1, 0, ["Ministério da Saúde", "Ministério da Educação", "Ministério da Justiça"])
ufs_var         = combo("UFs:", 2, 0, ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                                        "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"])
municipios_var  = combo("Municípios:", 3, 0, ["Belo Horizonte", "São Paulo", "Rio de Janeiro"])
esferas_var     = combo("Esferas:", 0, 1, ["Federal", "Estadual", "Municipal"])
poderes_var     = combo("Poderes:", 1, 1, ["Executivo", "Legislativo", "Judiciário"])
tipos_var       = combo("Tipos de Instrumento:", 2, 1, ["Edital", "Aviso", "Comunicado"])

# ── Modo Agendado ────────────────────────────────────────────────────────────
frame_agendador = tb.LabelFrame(frame_principal, text="⏰ Modo Agendado")
frame_agendador.pack(fill=X, pady=10, ipadx=5, ipady=5)

tb.Label(
    frame_agendador,
    text="• 07:00 → busca com data do DIA ANTERIOR\n• 12:00 → busca com data do DIA ATUAL",
    justify=LEFT
).pack(anchor=W)

label_status_agendador = tb.Label(
    frame_agendador,
    text="⏸ Agendamento parado.",
    bootstyle="secondary",
    font=('Helvetica', 10, 'italic')
)
label_status_agendador.pack(anchor=W, pady=(5, 0))

botao_agendador = tb.Button(
    frame_agendador,
    text="⏰ Iniciar Agendamento",
    bootstyle=WARNING,
    command=toggle_agendador
)
botao_agendador.pack(anchor=W, pady=5)

# ── Resultados ───────────────────────────────────────────────────────────────
tb.Label(frame_principal, text="Resultados:", font=('Helvetica', 11, 'bold')).pack(anchor=W, pady=(10, 2))
frame_resultados = ScrolledFrame(frame_principal, autohide=True, height=350, bootstyle="light")
frame_resultados.pack(fill=BOTH, expand=True, pady=5)
resultados_container = frame_resultados

# ── Log ──────────────────────────────────────────────────────────────────────
tb.Label(frame_principal, text="Log:", font=('Helvetica', 11, 'bold')).pack(anchor=W, pady=(10, 2))
log = tb.Text(frame_principal, height=10)
log.pack(fill=BOTH, expand=False, pady=(0, 5))

# ── Pesquisa Automática ──────────────────────────────────────────────────────
pesquisa_automatica_var = tb.BooleanVar(value=False)
chk_pesquisa_auto = tb.Checkbutton(
    frame_principal,
    text="Pesquisa Automática (baixar e processar todos os editais encontrados)",
    variable=pesquisa_automatica_var,
    bootstyle="round-toggle"
)
chk_pesquisa_auto.pack(anchor=W, pady=5)

# ── Botões principais ────────────────────────────────────────────────────────
frame_botoes = tb.Frame(frame_principal)
frame_botoes.pack(fill=X, pady=10)

botao_iniciar = tb.Button(frame_botoes, text="▶ Iniciar Pesquisas", bootstyle=SUCCESS)
botao_iniciar.pack(side=LEFT, expand=True, fill=X, padx=5)

botao_exportar = tb.Button(frame_botoes, text="📊 Exportar para Excel",
                           bootstyle=INFO, command=exportar_para_excel)
botao_exportar.pack(side=LEFT, expand=True, fill=X, padx=5)

# ── Ação do botão Iniciar ────────────────────────────────────────────────────
botao_iniciar.config(command=lambda: threading.Thread(
    target=iniciar_pesquisas,
    args=(
        entrada_palavras.get("1.0", END).splitlines(),
        converter_data(data_inicio.entry.get()),
        converter_data(data_fim.entry.get()),
        log,
        botao_iniciar,
        {
            "modalidades": modalidades_var.get(),
            "orgaos":      orgaos_var.get(),
            "ufs":         ufs_var.get(),
            "municipios":  municipios_var.get(),
            "esferas":     esferas_var.get(),
            "poderes":     poderes_var.get(),
            "tipos":        tipos_var.get()
        }
    ),
    daemon=True
).start())


# ── Fechar ───────────────────────────────────────────────────────────────────
def ao_fechar():
    global driver_global, agendador_ativo
    agendador_ativo = False
    if driver_global:
        try:
            driver_global.quit()
        except Exception:
            pass
    app.destroy()


app.protocol("WM_DELETE_WINDOW", ao_fechar)
app.mainloop()
