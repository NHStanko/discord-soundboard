package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"
)

func init() {
	flag.StringVar(&token, "t", "", "Bot Token")
	flag.Parse()
}

var token string
var buffer = make([][]byte, 0)

func main() {

	if token == "" {
		fmt.Println("No token provided. Please provide a token by running: samsdiscordbot -t <bot token>")
		os.Exit(1)
	}

	discord, err := discordgo.New("Bot " + token)
	if err != nil {
		fmt.Println("Failed to initialize bot: ", err)
		os.Exit(1)
	}

	fmt.Printf("discord.Identify.Token: %v\n", discord.Identify.Token)

	err = discord.Open()
	if err != nil {
		fmt.Println("Failed to open Discord session: ", err)
		os.Exit(1)
	}

	fmt.Printf("discord.Identify.Properties: %v\n", discord.Identify.Properties)

	fmt.Println("samsdiscordbot is now running. Press CTRL-C to exit.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc

	discord.Close()
	fmt.Println("Success!")
}
