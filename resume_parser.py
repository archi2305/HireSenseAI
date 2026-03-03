import PyPDF2

def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""

    for page in pdf_reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted

    return text