package conversion

import (
	"bytes"
	// "fmt"
	"log"

	// "os"
	"github.com/ledongthuc/pdf"
	// ext "github.com/unidoc/unipdf/v3/extractor"
	// "github.com/unidoc/unipdf/v3/model"
)


func ReadPdf(path string) (string, error) {
	file, r, err := pdf.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()
	totalPage := r.NumPage()

	var textBuilder bytes.Buffer
	for pageIndex := 1; pageIndex <= totalPage; pageIndex++ {
		p := r.Page(pageIndex)
		if p.V.IsNull() {
			continue
		}

		text, err := p.GetPlainText(nil)
		if err != nil {
			log.Printf("Failed to extract text from page %d: %v\n", pageIndex, err)
			continue
		}
		
		
		textBuilder.WriteString(text)
		textBuilder.WriteString("\n\n") // Add extra newline between pages
	}
	return textBuilder.String(), nil
}


// Used unidoc which requires liscence
// func ReadPdfUnidoc(path string) (string, error) {
// 	file, err := os.Open(path)
//     if err != nil {
//         return "", fmt.Errorf("failed to open PDF: %v", err)
//     }
//     defer file.Close()

//     pdfReader, err := model.NewPdfReader(file)
//     if err != nil {
//         return "", fmt.Errorf("failed to create PDF reader: %v", err)
//     }

//     isEncrypted, err := pdfReader.IsEncrypted()
//     if err != nil {
//         return "", fmt.Errorf("failed to check if PDF is encrypted: %v", err)
//     }
//     if isEncrypted {
//         if ok, err := pdfReader.Decrypt([]byte("")); !ok || err != nil {
//             return "", fmt.Errorf("failed to decrypt PDF: %v", err)
//         }
//     }

//     numPages, err := pdfReader.GetNumPages()
//     if err != nil {
//         return "", fmt.Errorf("failed to get number of pages: %v", err)
//     }

//     var textBuilder bytes.Buffer
//     for i := 1; i <= numPages; i++ {
//         page, err := pdfReader.GetPage(i)
//         if err != nil {
//             log.Printf("Failed to get page %d: %v\n", i, err)
//             continue
//         }

//         extractor,err := ext.New(page)
//         if err != nil {
//             log.Printf("Failed to create text extractor for page %d: %v\n", i, err)
//             continue
//         }

//         text, err := extractor.ExtractText()
//         if err != nil {
//             log.Printf("Failed to extract text from page %d: %v\n", i, err)
//             continue
//         }

//         textBuilder.WriteString(text)
//         textBuilder.WriteString("\n")
//     }

//     return textBuilder.String(), nil
// }
