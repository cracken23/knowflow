## File: `flow.py`

## This file constructs the flow by connecting the nodes. The flow starts with generating the title, cycles through subsequent sections, and finally compiles the paper.

from pocketflow import Flow
from nodes import DecidePaperStructure, GeneratePaperSection, CompilePaper

def create_paper_flow():
    """
    Create a flow that converts doxygen documentation into an IEEE-style research paper.
    
    Flow sequence:
      1. DecidePaperStructure generates the Title section.
      2. GeneratePaperSection produces remaining sections.
      3. CompilePaper merges sections into a complete document.
    """
    decide = DecidePaperStructure()
    gen_section = GeneratePaperSection()
    compile_node = CompilePaper()

    # Define flow transitions.
    decide - "generate_section" >> gen_section
    gen_section - "generate_section" >> gen_section
    gen_section - "compile_paper" >> compile_node

    return Flow(start=decide)