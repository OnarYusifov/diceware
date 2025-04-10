# Diceware Password Generator

## Overview

Diceware Password Generator is a web-based application that creates strong, memorable passphrases using the Diceware method. By simulating dice rolls to select words from a predefined wordlist, it produces secure passwords that are easy to remember yet difficult to crack. The tool features a modern, dark-themed interface with animations and a responsive design.

## Features

- **Customizable Word Count**: Choose between 3 and 8 words for your passphrase using interactive buttons (default is 5).
- **One-Click Generation**: Generate a new passphrase with the "Generate" button.
- **Copy Functionality**: Easily copy the passphrase to your clipboard with a dynamic copy button.
- **Animated Interface**: Enjoy a typing animation for passphrase display and smooth transitions throughout.
- **Secure Randomization**: Uses the Web Crypto API for cryptographically secure dice rolls.
- **Responsive Design**: Adapts to various screen sizes for a consistent experience.

## How It Works

The generator implements the Diceware method:

1. For each word, five dice rolls are simulated, producing a five-digit number (each digit from 1 to 6).
2. This number maps to a unique word in the `wordlist.txt` file.
3. The process repeats based on the selected word count, and the words are combined with spaces to form the passphrase.

For example, a 5-word passphrase might look like: `refried zipfile cascade unfunded quarterly`.

## Usage Instructions

1. **Select Word Count**: Click a button (3 to 8) to choose the number of words for your passphrase.
2. **Generate Passphrase**: Click the "Generate" button to create a new passphrase.
3. **View Result**: Watch the passphrase appear with a typing animation in the display area.
4. **Copy to Clipboard**: Click the clipboard icon next to the passphrase to copy it.

## Technical Details

- **Technologies Used**:
  - **HTML**: Structures the interface.
  - **CSS**: Provides styling, animations (e.g., `fadeIn`, `typeCharacter`), and responsiveness.
  - **JavaScript**: Handles logic, including wordlist loading, dice roll simulation, and animations.
