package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/adarsh-jaiss/transofrmo-lib/conversion"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

type request struct {
	URL string `json:"url"`
}

var req request

func main() {
	app := fiber.New()

	// Add CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000", "https://transform-doc.vercel.app"},
		AllowHeaders: []string{"Origin, Content-Type, Accept, Methods"},
		AllowMethods: []string{"GET,POST,HEAD,PUT,DELETE,PATCH"},
		AllowCredentials: true,
	}))


	app.Post("/", PDFHandler)
	
	app.Listen(":8000")

}

func PDFHandler(c fiber.Ctx) error {
	

	if err := c.Bind().Body(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": fmt.Sprintf("error parsing request: %v", err),
		})
	}

	// Call another function with the parsed URL
	res, err := DownloadAndReadPdf(req.URL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("error processing URL: %v", err),
		})
	}

	// res, err := conversion.Convert(req.URL)
	// if err!= nil {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 		"error": fmt.Sprintf("error processing URL: %v", err),
	// 	})
	// }

	return c.JSON(fiber.Map{
		"message": "URL processed successfully",
		"res" : res,
	})
}

func DownloadAndReadPdf(url string) (string, error) {
	// Download the PDF file
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("error downloading file: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to download file: %s", resp.Status)
	}

	// Check the Content-Type header
	if resp.Header.Get("Content-Type") != "application/pdf" {
		return "", fmt.Errorf("not a PDF file: invalid content type %s", resp.Header.Get("Content-Type"))
	}

	// Create a new file under the sample folder to save the downloaded PDF
	filePath := "sample/downloaded.pdf"
	outFile, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("error creating file: %v", err)
	}

	// Write the downloaded content to the file
	_, err = io.Copy(outFile, resp.Body)
	if err != nil {
		outFile.Close()
		return "", fmt.Errorf("error writing to file: %v", err)
	}

	// Close the file
	err = outFile.Close()
	if err != nil {
		return "", fmt.Errorf("error closing file: %v", err)
	}

	// Call ReadPdfWithLayout with the path to the file
	res, err := conversion.Convert(filePath)
	if err != nil {
		return "", err
	}

	// Delete the file after processing
	err = os.Remove(filePath)
	if err != nil {
		return "", fmt.Errorf("error deleting file: %v", err)
	}

	return res, nil
}

