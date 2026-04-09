
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{ULBreport}
\LoadClass[a4paper,11pt]{report}

\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage{csquotes}
\RequirePackage[french]{babel}
\RequirePackage[style=apa,backend=biber,sorting=nyt]{biblatex}
\DeclareLanguageMapping{french}{french-apa}

\RequirePackage{tabularx}
\RequirePackage[top=2.5cm,bottom=2.5cm,left=2.5cm,right=2.5cm]{geometry}
\RequirePackage{hyperref}
\RequirePackage{enumitem}
\RequirePackage{xkeyval}
\RequirePackage{ifthen}
\RequirePackage{titlesec}

\RequirePackage{tikz}
\usetikzlibrary{mindmap}
\RequirePackage{chemfig}
\RequirePackage{pgfplots}
\pgfplotsset{compat=newest}
\RequirePackage{graphicx}
\RequirePackage{textcomp}
\RequirePackage{eurosym}
\RequirePackage{mwe}
\RequirePackage{listings}
\RequirePackage{etoolbox}
\RequirePackage{setspace}
\RequirePackage{ccaption}
\RequirePackage{colortbl}
\RequirePackage{framed}
\RequirePackage{xcolor}
\RequirePackage{fourier}
\RequirePackage[pages=some]{background}

\RequirePackage{mathtools}
\RequirePackage{amsmath}
\RequirePackage{amsfonts}
\RequirePackage{amssymb}
\RequirePackage{mathrsfs}
\usetikzlibrary{arrows,matrix,positioning}
\usetikzlibrary{3d,calc}
\RequirePackage[makeroom]{cancel}
\RequirePackage{esint}

\RequirePackage[toc,page]{appendix}
\linespread{1.25}
\renewcommand{\appendixtocname}{Annexes}
\renewcommand{\appendixpagename}{Annexes}
\renewcommand{\contentsname}{Table des matieres}

\definecolor{apricot}{rgb}{0.98, 0.81, 0.69}
\definecolor{bleu}{rgb}{0.19, 0.55, 0.91}
\definecolor{rouge}{rgb}{0.77, 0.12, 0.23}
\definecolor{vert}{rgb}{0.13, 0.55, 0.13}
\definecolor{antiquefuchsia}{rgb}{0.57, 0.36, 0.51}
\definecolor{chaptergray}{gray}{0.35}
\colorlet{shadecolor}{cyan!30!white}
\colorlet{framecolor}{blue!50!black}
\hypersetup{
    colorlinks=true,
    allcolors=black,
    pdfborder={0 0 0}
}

\newcommand{\rouge}[1]{\textcolor{rouge}{#1}}
\newcommand{\bleu}[1]{\textcolor{bleu}{#1}}
\newcommand{\verts}[1]{\textcolor{vert}{#1}}

\titleformat{\chapter}[display]
  {\normalfont}
  {\raggedright\Large\bfseries\chaptertitlename\ \thechapter}
  {0.5ex}
  {\raggedright\LARGE\bfseries}
  []

\titleformat{name=\chapter,numberless}[display]
  {\normalfont}
  {}
  {0pt}
  {\raggedright\LARGE\bfseries}
  []

\titlespacing*{\chapter}{0pt}{-4pt}{18pt}

\makeatletter
\define@cmdkey [PRE] {fam} {title}{}
\define@cmdkey [PRE] {fam} {studies}{}
\define@cmdkey [PRE] {fam} {course}{}
\define@cmdkey [PRE] {fam} {author}{}
\define@cmdkey [PRE] {fam} {teacher}{}
\define@cmdkey [PRE] {fam} {date}{}
\define@cmdkey [PRE] {fam} {logo}{}
\define@cmdkey [PRE] {fam} {manyAuthor}[1]{}
\presetkeys         [PRE] {fam} {title=titre,
								 studies=,
								 course=,
								 author=Auteurs,
								 teacher=,
								 date=,
								 logo=7,
                                 manyAuthor=8,}{}
\tikzset{vertical custom shading/.code={%
 \pgfmathsetmacro\tikz@vcs@middle{#1}
 \pgfmathsetmacro\tikz@vcs@bottom{\tikz@vcs@middle/2}
 \pgfmathsetmacro\tikz@vcs@top{(100-\tikz@vcs@middle)/2+\tikz@vcs@middle}
\pgfdeclareverticalshading[tikz@axis@top,tikz@axis@middle,tikz@axis@bottom]{newaxis}{100bp}{%
  color(0bp)=(tikz@axis@bottom);
  color(\tikz@vcs@bottom bp)=(tikz@axis@bottom);
  color(\tikz@vcs@middle bp)=(tikz@axis@middle);
  color(\tikz@vcs@top bp)=(tikz@axis@top);
  color(100bp)=(tikz@axis@top)}
  \pgfkeysalso{/tikz/shading=newaxis}
  }
}
\newcommand*{\titleULB}[1]{\setkeys[PRE]{fam}{#1}

	\begingroup
	\BgThispage
	\ifthenelse{\equal{\cmdPRE@fam@logo}{7}}{}{\begin{center}\includegraphics[height=2.2cm,width=20cm,keepaspectratio]{\cmdPRE@fam@logo}\\\end{center}}
		{\cmdPRE@fam@studies}
	\begin{center}
	\vspace*{\baselineskip}
	{\bfseries \cmdPRE@fam@course}\\[\baselineskip]
	\rule{\textwidth}{1.6pt}\vspace*{-\baselineskip}\vspace*{2pt}
	\rule{\textwidth}{0.4pt}\\[\baselineskip]
	{\Huge \cmdPRE@fam@title}\\[\baselineskip]
	\rule{\textwidth}{0.4pt}\vspace*{-\baselineskip}\vspace{3.2pt}
	\rule{\textwidth}{1.6pt}\\[\baselineskip]
	\ifthenelse{\equal{\cmdPRE@fam@manyAuthor}{8}}{
	{\Large \cmdPRE@fam@author}\\[\baselineskip]
	{\bfseries \cmdPRE@fam@teacher}}{
	    \begin{minipage}{0.4\textwidth}
	        \begin{flushleft} \large
	        \cmdPRE@fam@author
	        \end{flushleft}
	    \end{minipage}
	    \begin{minipage}{0.4\textwidth}
	        \begin{flushright} \large
	        \cmdPRE@fam@teacher
	        \end{flushright}
	    \end{minipage}
	}
	\vfill
	{\cmdPRE@fam@date}
	\end{center}
	\vspace*{3\baselineskip}
	\pagenumbering{gobble}
	\newpage
	\pagenumbering{roman}
\endgroup}

\makeatother
\newenvironment{frshaded*}{%
	\def\FrameCommand{\fboxrule=\FrameRule\fboxsep=\FrameSep \fcolorbox{framecolor}{shadecolor}}%
	\MakeFramed {\advance\hsize-\width \FrameRestore}}%
{\endMakeFramed}
\newcommand{\sceau}[1]{\backgroundsetup{
scale=1,
color=black,
opacity=0.05,
angle=10,
position={12cm,-22cm},
contents={%
  \includegraphics[height=20cm,width=20cm,keepaspectratio]{#1}
  }%
}}
