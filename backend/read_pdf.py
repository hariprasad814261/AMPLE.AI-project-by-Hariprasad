import PyPDF2

def extract_text():
    with open('AMPLE.AI MARKETING RESEARCH.pdf', 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        
        with open('output.txt', 'w', encoding='utf-8', errors='replace') as out:
            out.write(text)

if __name__ == '__main__':
    extract_text()
