import pdfplumber
from PyPDF2 import PdfReader
from docx import Document

def extract_text_from_pdf(file_source):
    text = ""
    try:
        with pdfplumber.open(file_source) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"PDF parsing error:", e)

    # Fallback parser for PDFs that pdfplumber cannot read reliably.
    if text.strip():
        return text

    try:
        reader = PdfReader(file_source)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print("PyPDF2 fallback parsing error:", e)

    return text


def extract_text_from_docx(file_source):
    text = ""
    try:
        document = Document(file_source)
        paragraphs = [p.text for p in document.paragraphs if p.text]
        text = "\n".join(paragraphs)
    except Exception as e:
        print("DOCX parsing error:", e)
    return text


def extract_text_from_file(file_source, filename):
    ext = (filename or "").lower().rsplit(".", 1)
    extension = f".{ext[-1]}" if len(ext) > 1 else ""

    if extension == ".pdf":
        return extract_text_from_pdf(file_source)
    if extension == ".docx":
        return extract_text_from_docx(file_source)

    return ""