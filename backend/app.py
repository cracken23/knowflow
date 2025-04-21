from flask import Flask, request, send_file, jsonify
from jinja2 import Environment, FileSystemLoader
import os
import subprocess
import uuid

app = Flask(__name__)

@app.route('/api/show_paper', methods=['POST'])
def generate_paper():
    data = request.get_json()
    title = data.get('title', 'Untitled')
    abstract = data.get('abstract', 'No abstract provided.')
    conclusion = data.get('conclusion', '')
    references = data.get('references', '')

    # Setup
    unique_id = str(uuid.uuid4())
    tex_filename = f"{unique_id}.tex"
    pdf_filename = f"{unique_id}.pdf"
    working_dir = os.path.join('static', 'papers')
    os.makedirs(working_dir, exist_ok=True)

    # Render LaTeX template
    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template('ieee_generate_paper_template.tex')
    rendered_tex = template.render(
        title=title,
        abstract=abstract,
        conclusion=conclusion,
        references=references,
    )

    # Save .tex file
    tex_path = os.path.join(working_dir, tex_filename)
    with open(tex_path, 'w') as f:
        f.write(rendered_tex)

    # Compile PDF
    try:
        subprocess.run(
            ['pdflatex', '-output-directory', working_dir, tex_filename],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    except subprocess.CalledProcessError:
        return jsonify({'error': 'PDF compilation failed'}), 500

    # Serve PDF
    pdf_path = os.path.join(working_dir, pdf_filename)
    return send_file(pdf_path, as_attachment=True, download_name='research_paper.pdf')