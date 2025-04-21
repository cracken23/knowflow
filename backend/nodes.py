from pocketflow import Node
import textwrap
from utils import call_llm  # Ensure call_llm is defined in utils.py

def parse_plain_response(response):
    section = None
    next_action = None
    content_lines = []
    current_field = None

    for raw_line in response.splitlines():
        line = raw_line.strip()
        if line.startswith("Section:"):
            section = line[len("Section:"):].strip()
            current_field = None
        elif line.startswith("Content:"):
            current_field = "Content"
            # capture inline content if present
            inline = line[len("Content:"):].strip()
            if inline:
                content_lines.append(inline)
        elif line.startswith("Next Action:"):
            next_action = line[len("Next Action:"):].strip()
            current_field = None
        else:
            if current_field == "Content":
                # Preserve the original text of the content line
                content_lines.append(raw_line.strip())
    content = "\n".join(content_lines).strip()
    return section, content, next_action


# This node initializes the research paper structure using IEEE guidelines.
class DecidePaperStructure(Node):
    def prep(self, shared):
        # Retrieve the provided doxygen code documentation.
        documentation = shared.get("documentation", "No documentation provided")
        # Define the IEEE-compliant sections for the research paper.
        sections = [
            "Title",
            "Abstract",
            "Introduction",
            "Methodology",
            "Results & Discussion",
            "Conclusion",
            "References"
        ]
        shared["sections"] = sections
        # Initialize the index for tracking which section to generate.
        shared["current_section"] = 0
        return documentation

    def exec(self, documentation):
        # Generate the Title section in IEEE style.
        prompt = textwrap.dedent(f"""
            You are a highly qualified research paper writer tasked with producing a research paper strictly in IEEE format with high academic value.
            Use the following code documentation (from doxygen) as the basis for your work:

            {documentation}

            Begin by generating the 'Title' section. Ensure the title is concise, technically precise, and conforms to IEEE standards.
            Format your response as follows:

            Section: Title
            Content:
            <Generated Title content in IEEE style>
            Next Action: generate_next
        """)
        response = call_llm(prompt)
        # Parse the plain text response.
        section, content, next_action = parse_plain_response(response)
        # Return a dictionary with the parsed info.
        return {"section": section, "content": content, "next_action": next_action}

    def post(self, shared, prep_res, exec_res):
        section_index = shared.get("current_section", 0)
        current_section = shared["sections"][section_index]
        shared.setdefault("paper_sections", {})[current_section] = exec_res["content"]
        print(f"📝 Generated {current_section} section.")
        # Update the index for the next section.
        shared["current_section"] = section_index + 1
        # Decide next node: if there are more sections, go to generate_section; else, compile_paper.
        if shared["current_section"] < len(shared["sections"]):
            return "generate_section"
        else:
            return "compile_paper"


# This node generates each remaining section in the IEEE format.
class GeneratePaperSection(Node):
    def prep(self, shared):
        section_index = shared.get("current_section", 0)
        sections = shared.get("sections", [])
        # Ensure a section is left to process.
        if section_index < len(sections):
            section_name = sections[section_index]
            return section_name, shared.get("documentation", "")
        else:
            return None

    def exec(self, inputs):
        if inputs is None:
            return {}
        section_name, documentation = inputs
        prompt = textwrap.dedent(f"""
        You are a research paper writer tasked with composing a section of a research paper strictly following IEEE format.
        The paper is based on the following doxygen-generated code documentation:

        {documentation}

        Now, generate the '{section_name}' section. Ensure that your response is written with high academic quality,
        adheres to IEEE formatting rules, and employs appropriate technical language.
        Format your response as follows:

        Section: {section_name}
        Content:
        <Generated content for {section_name} in IEEE style>
        Next Action: generate_next
        """)
        response = call_llm(prompt)
        # Parse the plain text response.
        section, content, next_action = parse_plain_response(response)
        return {"section": section, "content": content, "next_action": next_action}

    def post(self, shared, prep_res, exec_res):
        section_index = shared.get("current_section", 0)
        sections = shared["sections"]
        current_section = sections[section_index]
        shared.setdefault("paper_sections", {})[current_section] = exec_res["content"]
        print(f"📝 Generated {current_section} section.")
        shared["current_section"] = section_index + 1
        # Decide whether to generate another section or compile the paper.
        if shared["current_section"] < len(sections):
            return "generate_section"
        else:
            return "compile_paper"


# This node compiles all generated sections into a single research paper.
class CompilePaper(Node):
    def prep(self, shared):
        return shared.get("paper_sections", {})

    def exec(self, paper_sections):
        # Define the ordered sections per IEEE style.
        ordered_sections = [
            "Title",
            "Abstract",
            "Introduction",
            "Methodology",
            "Results & Discussion",
            "Conclusion",
            "References"
        ]
        compiled = ""
        for section in ordered_sections:
            content = paper_sections.get(section, "")
            # Simple underlined headings; adjust as needed for IEEE-specific formatting.
            compiled += f"{section}\n{'=' * len(section)}\n{content}\n\n"
        return compiled

    def post(self, shared, prep_res, exec_res):
        shared["final_paper"] = exec_res
        print("📄 Research paper compiled successfully.")
        return "done"
