#!/usr/bin/env python3
"""
Code Instrumentation Script for Debug Mode

Automatically injects logging statements into source files to collect
runtime data for debugging. Supports Python, JavaScript/TypeScript.

Usage:
    python3 instrument.py <target-file> [options]

Options:
    --functions func1,func2    Instrument specific functions only
    --lines 10,20,30           Add state logging at specific line numbers
    --restore                  Restore original file from backup
    --session-id ID            Custom session ID for log correlation (default: auto-generated)
    --output-file PATH         Write instrumented code to different file instead of in-place

Examples:
    python3 instrument.py app.py --functions process_order,validate_input
    python3 instrument.py server.js --lines 45,67,89
    python3 instrument.py app.py --restore
"""

import argparse
import ast
import os
import re
import shutil
import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional


def generate_session_id() -> str:
    """Generate a short unique session ID for log correlation."""
    return uuid.uuid4().hex[:8]


def get_language(filepath: str) -> Optional[str]:
    """Detect programming language from file extension."""
    ext = Path(filepath).suffix.lower()
    if ext == '.py':
        return 'python'
    elif ext in ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']:
        return 'javascript'
    return None


def create_backup(filepath: str) -> str:
    """Create a backup of the original file."""
    backup_path = filepath + '.debug_backup'
    shutil.copy2(filepath, backup_path)
    return backup_path


def restore_backup(filepath: str) -> bool:
    """Restore the original file from backup."""
    backup_path = filepath + '.debug_backup'
    if os.path.exists(backup_path):
        shutil.copy2(backup_path, filepath)
        os.remove(backup_path)
        return True
    return False


# =============================================================================
# Python Instrumentation
# =============================================================================

class PythonInstrumentor(ast.NodeTransformer):
    """AST transformer to inject logging into Python code."""

    def __init__(self, session_id: str, target_functions: Optional[list] = None):
        self.session_id = session_id
        self.target_functions = target_functions
        self.instrumented_functions = []

    def visit_FunctionDef(self, node):
        """Instrument function definitions with entry/exit logging."""
        # Skip if we're targeting specific functions and this isn't one
        if self.target_functions and node.name not in self.target_functions:
            return self.generic_visit(node)

        self.instrumented_functions.append(node.name)

        # Create entry log statement
        args_dict = ', '.join(f'"{arg.arg}": {arg.arg}' for arg in node.args.args)
        entry_log = ast.parse(
            f'print(f"[DEBUG:{self.session_id}] {{__import__(\'datetime\').datetime.now().isoformat()}} | {node.name}:{{__import__(\'inspect\').currentframe().f_lineno}} | ENTRY | args={{{{{args_dict}}}}}")'
        ).body[0]

        # Wrap function body in try/finally for exit logging
        original_body = node.body.copy()

        # Create exit log for normal returns
        exit_log = ast.parse(
            f'print(f"[DEBUG:{self.session_id}] {{__import__(\'datetime\').datetime.now().isoformat()}} | {node.name}:{{__import__(\'inspect\').currentframe().f_lineno}} | EXIT | return=None")'
        ).body[0]

        # Build new function body
        node.body = [entry_log] + original_body + [exit_log]

        return self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node):
        """Handle async functions the same as regular functions."""
        return self.visit_FunctionDef(node)


def instrument_python(code: str, session_id: str,
                      target_functions: Optional[list] = None,
                      target_lines: Optional[list] = None) -> tuple[str, list]:
    """
    Instrument Python code with debug logging.

    Returns:
        Tuple of (instrumented_code, list_of_instrumented_functions)
    """
    lines = code.split('\n')

    # Add line-specific logging first (before AST transformation)
    if target_lines:
        for line_num in sorted(target_lines, reverse=True):
            if 0 < line_num <= len(lines):
                indent = len(lines[line_num - 1]) - len(lines[line_num - 1].lstrip())
                indent_str = ' ' * indent
                # Get local variables at this point
                log_stmt = f'{indent_str}print(f"[DEBUG:{session_id}] {{__import__(\'datetime\').datetime.now().isoformat()}} | line:{line_num} | STATE | locals={{{{k: v for k, v in locals().items() if not k.startswith(\'_\')}}}}")'
                lines.insert(line_num, log_stmt)

    modified_code = '\n'.join(lines)

    # Parse and transform AST for function instrumentation
    try:
        tree = ast.parse(modified_code)
        instrumentor = PythonInstrumentor(session_id, target_functions)
        modified_tree = instrumentor.visit(tree)
        ast.fix_missing_locations(modified_tree)

        # Convert back to source code
        import_stmt = "import inspect\nfrom datetime import datetime\n"
        result = import_stmt + ast.unparse(modified_tree)

        return result, instrumentor.instrumented_functions
    except SyntaxError as e:
        print(f"Warning: Could not parse Python code with AST: {e}")
        print("Falling back to regex-based instrumentation")
        return instrument_python_regex(modified_code, session_id, target_functions)


def instrument_python_regex(code: str, session_id: str,
                           target_functions: Optional[list] = None) -> tuple[str, list]:
    """Fallback regex-based Python instrumentation."""
    lines = code.split('\n')
    instrumented_functions = []
    result_lines = []

    # Add imports at the top
    result_lines.append("import inspect")
    result_lines.append("from datetime import datetime")
    result_lines.append("")

    func_pattern = re.compile(r'^(\s*)(async\s+)?def\s+(\w+)\s*\((.*?)\)\s*:')

    i = 0
    while i < len(lines):
        line = lines[i]
        match = func_pattern.match(line)

        if match:
            indent = match.group(1)
            is_async = match.group(2) or ''
            func_name = match.group(3)
            params = match.group(4)

            if target_functions is None or func_name in target_functions:
                instrumented_functions.append(func_name)
                result_lines.append(line)

                # Add entry logging after the def line
                body_indent = indent + '    '
                param_names = [p.strip().split(':')[0].split('=')[0].strip()
                             for p in params.split(',') if p.strip()]
                args_format = ', '.join(f'"{p}": {{{p}}}' for p in param_names if p)

                entry_log = f'{body_indent}print(f"[DEBUG:{session_id}] {{datetime.now().isoformat()}} | {func_name}:{{inspect.currentframe().f_lineno}} | ENTRY | args={{{{{args_format}}}}}")'
                result_lines.append(entry_log)
            else:
                result_lines.append(line)
        else:
            result_lines.append(line)

        i += 1

    return '\n'.join(result_lines), instrumented_functions


# =============================================================================
# JavaScript/TypeScript Instrumentation
# =============================================================================

def instrument_javascript(code: str, session_id: str,
                         target_functions: Optional[list] = None,
                         target_lines: Optional[list] = None) -> tuple[str, list]:
    """
    Instrument JavaScript/TypeScript code with debug logging.
    Uses regex-based approach for broad compatibility.

    Returns:
        Tuple of (instrumented_code, list_of_instrumented_functions)
    """
    lines = code.split('\n')
    instrumented_functions = []

    # Patterns for different function declarations
    patterns = [
        # function name(params) {
        re.compile(r'^(\s*)(async\s+)?function\s+(\w+)\s*\((.*?)\)\s*\{'),
        # const/let/var name = function(params) {
        re.compile(r'^(\s*)(const|let|var)\s+(\w+)\s*=\s*(async\s+)?function\s*\((.*?)\)\s*\{'),
        # const/let/var name = (params) => {
        re.compile(r'^(\s*)(const|let|var)\s+(\w+)\s*=\s*(async\s+)?\((.*?)\)\s*=>\s*\{'),
        # name(params) { (method definition)
        re.compile(r'^(\s*)(async\s+)?(\w+)\s*\((.*?)\)\s*\{'),
    ]

    result_lines = []

    # Add line-specific logging first
    if target_lines:
        for line_num in sorted(target_lines, reverse=True):
            if 0 < line_num <= len(lines):
                indent = len(lines[line_num - 1]) - len(lines[line_num - 1].lstrip())
                indent_str = ' ' * indent
                log_stmt = f'{indent_str}console.log(`[DEBUG:{session_id}] ${{new Date().toISOString()}} | line:{line_num} | STATE |`, {{...Object.fromEntries(Object.entries({{...this}}).filter(([k]) => !k.startsWith("_")))}});'
                lines.insert(line_num, log_stmt)

    i = 0
    while i < len(lines):
        line = lines[i]
        matched = False

        for pattern in patterns:
            match = pattern.match(line)
            if match:
                groups = match.groups()

                # Extract function name and params based on pattern
                if 'const' in str(groups) or 'let' in str(groups) or 'var' in str(groups):
                    # const/let/var patterns
                    indent = groups[0]
                    func_name = groups[2]
                    params = groups[4] if len(groups) > 4 else groups[3]
                else:
                    # Regular function or method
                    indent = groups[0]
                    func_name = groups[2] if groups[1] and 'async' in str(groups[1]) else groups[2]
                    if func_name == 'async':
                        func_name = groups[2]
                    params = groups[3] if len(groups) > 3 else ''

                if target_functions is None or func_name in target_functions:
                    instrumented_functions.append(func_name)
                    result_lines.append(line)

                    # Add entry logging
                    body_indent = indent + '  '
                    param_names = [p.strip().split(':')[0].split('=')[0].strip()
                                 for p in params.split(',') if p.strip()]
                    args_obj = ', '.join(f'{p}' for p in param_names if p)

                    entry_log = f'{body_indent}console.log(`[DEBUG:{session_id}] ${{new Date().toISOString()}} | {func_name}:${{new Error().stack?.split("\\n")[1]?.match(/:(\d+):/)?.[1] || "?"}} | ENTRY | args=`, {{{args_obj}}});'
                    result_lines.append(entry_log)
                    matched = True
                    break

        if not matched:
            result_lines.append(line)

        i += 1

    return '\n'.join(result_lines), instrumented_functions


# =============================================================================
# Main Entry Point
# =============================================================================

def instrument_file(filepath: str, session_id: str,
                   target_functions: Optional[list] = None,
                   target_lines: Optional[list] = None,
                   output_file: Optional[str] = None) -> dict:
    """
    Instrument a source file with debug logging.

    Args:
        filepath: Path to the file to instrument
        session_id: Unique session ID for log correlation
        target_functions: Optional list of function names to instrument
        target_lines: Optional list of line numbers to add state logging
        output_file: Optional path for output (default: in-place modification)

    Returns:
        Dictionary with instrumentation results
    """
    if not os.path.exists(filepath):
        return {'success': False, 'error': f'File not found: {filepath}'}

    language = get_language(filepath)
    if not language:
        return {'success': False, 'error': f'Unsupported file type: {filepath}'}

    with open(filepath, 'r') as f:
        original_code = f.read()

    # Create backup before modifying
    backup_path = create_backup(filepath)

    # Instrument based on language
    if language == 'python':
        instrumented_code, functions = instrument_python(
            original_code, session_id, target_functions, target_lines
        )
    elif language == 'javascript':
        instrumented_code, functions = instrument_javascript(
            original_code, session_id, target_functions, target_lines
        )
    else:
        return {'success': False, 'error': f'Unsupported language: {language}'}

    # Write instrumented code
    output_path = output_file or filepath
    with open(output_path, 'w') as f:
        f.write(instrumented_code)

    return {
        'success': True,
        'language': language,
        'session_id': session_id,
        'backup_path': backup_path,
        'output_path': output_path,
        'instrumented_functions': functions,
        'target_lines': target_lines or []
    }


def main():
    parser = argparse.ArgumentParser(
        description='Instrument code with debug logging for systematic debugging'
    )
    parser.add_argument('file', help='Source file to instrument')
    parser.add_argument('--functions', '-f',
                       help='Comma-separated list of functions to instrument')
    parser.add_argument('--lines', '-l',
                       help='Comma-separated list of line numbers for state logging')
    parser.add_argument('--restore', '-r', action='store_true',
                       help='Restore original file from backup')
    parser.add_argument('--session-id', '-s',
                       help='Custom session ID (default: auto-generated)')
    parser.add_argument('--output-file', '-o',
                       help='Output file path (default: in-place modification)')

    args = parser.parse_args()

    if args.restore:
        if restore_backup(args.file):
            print(f"Restored original file: {args.file}")
            sys.exit(0)
        else:
            print(f"No backup found for: {args.file}")
            sys.exit(1)

    session_id = args.session_id or generate_session_id()
    target_functions = args.functions.split(',') if args.functions else None
    target_lines = [int(x) for x in args.lines.split(',')] if args.lines else None

    result = instrument_file(
        args.file,
        session_id,
        target_functions,
        target_lines,
        args.output_file
    )

    if result['success']:
        print(f"Successfully instrumented {args.file}")
        print(f"  Language: {result['language']}")
        print(f"  Session ID: {result['session_id']}")
        print(f"  Backup: {result['backup_path']}")
        if result['instrumented_functions']:
            print(f"  Functions: {', '.join(result['instrumented_functions'])}")
        if result['target_lines']:
            print(f"  Lines: {', '.join(map(str, result['target_lines']))}")
        print(f"\nTo restore original: python3 {sys.argv[0]} {args.file} --restore")
    else:
        print(f"Error: {result['error']}")
        sys.exit(1)


if __name__ == '__main__':
    main()
