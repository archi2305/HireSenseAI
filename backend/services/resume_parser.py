from PyPDF2 import PdfReader

def extract_text_from_pdf(file):
    text = ""

    try:
        reader = PdfReader(file)

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    except Exception as e:
        print("PDF parsing error:", e)

    return text