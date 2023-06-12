#!/bin/bash

# Function to display a spinning indicator (spinner)
spin()
{
   local -r delay=0.1
   local spinstr='\|/-'
   while kill -0 "$1" 2>/dev/null; do
      local temp=${spinstr#?}
      printf " [%c]  " "$spinstr"
      local spinstr=$temp${spinstr%"$temp"}
      sleep $delay
      printf "\b\b\b\b\b\b"
   done
   printf "    \b\b\b\b"
}

# Suppressing output and showing spinner
run_command()
{
   echo -e "\nRunning $1..."
   $2 > /dev/null 2>&1 &
   # Call spinner function
   spin $!
   echo " Done."
}

# Using our new function to run commands
run_command "initial pdflatex" "pdflatex -interaction=nonstopmode --output-directory ../out ./De_Wilde_Louis_TFEJuin2023_rapport.tex"
run_command "makeglossaries" "makeglossaries -d ../out De_Wilde_Louis_TFEJuin2023_rapport"
run_command "second pdflatex" "pdflatex -interaction=nonstopmode --output-directory ../out ./De_Wilde_Louis_TFEJuin2023_rapport.tex"

echo -e "\nCopying .bib file to out directory..."
run_command "cp" "cp *.bib ../out"

echo -e "\nRunning bibtex..."
cd ../out
run_command "bibtex" "bibtex De_Wilde_Louis_TFEJuin2023_rapport"
cd -

run_command "third pdflatex" "pdflatex -interaction=nonstopmode --output-directory ../out ./De_Wilde_Louis_TFEJuin2023_rapport.tex"
run_command "final pdflatex" "pdflatex -interaction=nonstopmode --output-directory ../out ./De_Wilde_Louis_TFEJuin2023_rapport.tex"

# Deleting bib file from output directory
echo -e "\nDeleting bib file from output directory..."
rm ../out/bib.bib


echo -e "\nAll done!"