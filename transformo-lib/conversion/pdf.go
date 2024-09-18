package conversion

import (
	"fmt"
	"os"

	"github.com/pdfcrowd/pdfcrowd-go"
)

func Convert(path string) (string, error) {
	// create the API client instance
	client := pdfcrowd.NewPdfToTextClient("demo", "ce544b6ea52a5621fb9d55f8b542d14d")
	txt, err := client.ConvertFile(path)
	if err != nil {
		handleError(err)
		return "", err
	}
	fmt.Println(string(txt))
	return string(txt), nil

}

func handleError(err error) {
	if err != nil {
		why, ok := err.(pdfcrowd.Error)
		if ok {
			os.Stderr.WriteString(fmt.Sprintf("Pdfcrowd Error: %s\n", why))
		} else {
			os.Stderr.WriteString(fmt.Sprintf("Generic Error: %s\n", err))
		}

		panic(err.Error())
	}
}
