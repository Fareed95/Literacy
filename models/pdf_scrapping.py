import os
import requests
from googlesearch import search

def search_and_download_pdf(topic, save_dir="temp_pdfs"):
    # Create temporary directory for downloads
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    # Google search for PDF files
    query = f"{topic} filetype:pdf"
    pdf_links = []
    for url in search(query, num_results=5):  # Limit to 5 results
        if url.endswith(".pdf"):
            pdf_links.append(url)

    if not pdf_links:
        return {"error": "No PDFs found for the given topic."}

    downloaded_files = []
    for i, link in enumerate(pdf_links, start=1):
        try:
            response = requests.get(link, stream=True)
            if response.status_code == 200:
                pdf_path = os.path.join(save_dir, f"{topic.replace(' ', '_')}_{i}.pdf")
                with open(pdf_path, "wb") as pdf_file:
                    for chunk in response.iter_content(1024):
                        pdf_file.write(chunk)
                downloaded_files.append(pdf_path)
            else:
                print(f"Failed to download: {link}")
        except Exception as e:
            print(f"Error downloading {link}: {e}")

    return {"files": downloaded_files, "links": pdf_links}
