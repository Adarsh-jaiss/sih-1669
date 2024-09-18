package conversion

import (
	"bytes"
	
	"log"
	"math"
	"sort"
	"strings"
	"unicode"

	"github.com/ledongthuc/pdf"
)

type TextElement struct {
	Text     string
	FontSize float64
	FontName string
	X        float64
	Y        float64
}




func ReadPdfWithLayout(path string) (string, error) {
	file, r, err := pdf.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()
	totalPage := r.NumPage()

	var allTextElements []TextElement

	for pageIndex := 1; pageIndex <= totalPage; pageIndex++ {
		p := r.Page(pageIndex)
		if p.V.IsNull() {
			continue
		}

		// Extract layout information
		elements, err := extractTextElements(&p)
		if err != nil {
			log.Printf("Failed to extract layout from page %d: %v\n", pageIndex, err)
			continue
		}
		allTextElements = append(allTextElements, elements...)
	}

	// Post-process the extracted text using layout information
	processedText := postProcessWithLayout(allTextElements)

	return processedText, nil
}

func extractTextElements(p *pdf.Page) ([]TextElement, error) {
	var elements []TextElement
	var currentX, currentY float64
	var currentFontSize float64
	var currentFontName string

	fonts := make(map[string]*pdf.Font)
	for _, fontName := range p.Fonts() {
		f := p.Font(fontName)
		fonts[fontName] = &f
	}

	content := p.V.Key("Contents")
	pdf.Interpret(content, func(stk *pdf.Stack, op string) {
		switch op {
		case "Td", "TD":
			if stk.Len() >= 2 {
				currentY += stk.Pop().Float64()
				currentX += stk.Pop().Float64()
			}
		case "Tm":
			if stk.Len() >= 6 {
				currentY = stk.Pop().Float64()
				currentX = stk.Pop().Float64()
				stk.Pop() // Discard unused values
				stk.Pop()
				stk.Pop()
				stk.Pop()
			}
		case "Tf":
			if stk.Len() >= 2 {
				currentFontSize = stk.Pop().Float64()
				currentFontName = stk.Pop().Name()
			}
		case "TJ", "Tj":
			if stk.Len() >= 1 {
				text := ""
				if op == "TJ" {
					v := stk.Pop()
					for i := 0; i < v.Len(); i++ {
						item := v.Index(i)
						if item.Kind() == pdf.String {
							text += item.RawString()
						}
					}
				} else {
					str := stk.Pop()
					text = str.Text()
				}

				// Decode the text using the current font's encoding
				if font, ok := fonts[currentFontName]; ok {
					text = font.Encoder().Decode(text)
				}

				elements = append(elements, TextElement{
					Text:     text,
					FontSize: currentFontSize,
					FontName: currentFontName,
					X:        currentX,
					Y:        currentY,
				})
			}
		}
	})

	return elements, nil
}

func postProcessWithLayout(elements []TextElement) string {
	// Sort elements by Y (descending) and X (ascending)
	sort.Slice(elements, func(i, j int) bool {
		if math.Abs(elements[i].Y-elements[j].Y) < 1 {
			return elements[i].X < elements[j].X
		}
		return elements[i].Y > elements[j].Y
	})

	// Group elements into lines
	var lines [][]TextElement
	var currentLine []TextElement
	var lastY float64
	for _, elem := range elements {
		if len(currentLine) == 0 || math.Abs(elem.Y-lastY) < 1 {
			currentLine = append(currentLine, elem)
		} else {
			lines = append(lines, currentLine)
			currentLine = []TextElement{elem}
		}
		lastY = elem.Y
	}
	if len(currentLine) > 0 {
		lines = append(lines, currentLine)
	}

	// Format the text
	var result bytes.Buffer
	var lastFontSize float64
	for i, line := range lines {
		if i > 0 {
			result.WriteString("\n")

			// Add extra newline before larger font sizes
			if line[0].FontSize > lastFontSize {
				result.WriteString("\n")
			}
		}

		for j, elem := range line {
			if j > 0 {
				// Add space between elements if there's a gap
				gap := elem.X - (line[j-1].X + float64(len(line[j-1].Text))*line[j-1].FontSize*0.5)
				if gap > elem.FontSize*0.5 {
					result.WriteString(" ")
				}
			}

			result.WriteString(elem.Text)
			lastFontSize = elem.FontSize
		}
	}

	return postProcessText(result.String())
}

func postProcessText(text string) string {
	lines := strings.Split(text, "\n")
	var processedLines []string

	for _, line := range lines {
		line = strings.TrimSpace(line)
		line = strings.ReplaceAll(line, "∗", "*")
		line = strings.ReplaceAll(line, "§", "§")
		line = strings.ReplaceAll(line, "ï", "•")

		// Handle specific formatting issues
		if strings.HasPrefix(line, "# ") {
			line = strings.TrimPrefix(line, "# ")
		}
		if strings.HasSuffix(line, "Remote •") {
			line = strings.TrimSuffix(line, "Remote •")
			processedLines = append(processedLines, line, "Remote", "•")
		} else {
			processedLines = append(processedLines, line)
		}
	}

	// Join lines, preserving empty lines for structure
	var result strings.Builder
	for i, line := range processedLines {
		if i > 0 && (line == "" || unicode.IsUpper(rune(line[0]))) {
			result.WriteString("\n")
		}
		result.WriteString(line)
		result.WriteString("\n")
	}

	return strings.TrimSpace(result.String())
}