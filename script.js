// Global variable to store the word-to-number mapping
let wordMap = {};

// Load the wordlist.txt file on page load with enhanced error handling
fetch("wordlist.txt")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - Unable to load wordlist.txt`
      );
    }
    return response.text();
  })
  .then((text) => {
    const lines = text.trim().split("\n");
    let loadedWords = 0;
    lines.forEach((line) => {
      const [number, word] = line.trim().split(/\s+/);
      if (number && word && number.length === 5 && /^[1-6]{5}$/.test(number)) {
        wordMap[number] = word;
        loadedWords++;
      } else {
        console.warn(`Invalid line in wordlist.txt: ${line}`);
      }
    });
    console.log(`Loaded ${loadedWords} valid words from wordlist.txt`);
    if (loadedWords === 0) {
      alert(
        "Wordlist loaded, but no valid entries found. Please check wordlist.txt format."
      );
    } else if (loadedWords < 7776) {
      console.warn(
        `Warning: Only ${loadedWords} words loaded. Expected 7776 words for a complete diceware list.`
      );
    }
  })
  .catch((error) => {
    console.error("Error loading wordlist.txt:", error);
    alert(
      `Failed to load wordlist.txt. Error: ${error.message}\n\nEnsure the file is accessible and try refreshing the page.`
    );
    document.getElementById("generateBtn").disabled = true;
    document.getElementById("generateBtn").style.cursor = "not-allowed";
    document.getElementById("generateBtn").style.opacity = "0.5";
  });

// Simulate a single die roll (1 to 6) using Web Crypto API for security
function rollDice() {
  let value;
  do {
    const array = new Uint8Array(1);
    window.crypto.getRandomValues(array);
    value = array[0];
  } while (value >= 252); // Ensure uniform distribution (0 to 251)
  return (value % 6) + 1;
}

// Generate a 5-digit number by simulating 5 dice rolls
function generateNumber() {
  let number = "";
  for (let i = 0; i < 5; i++) {
    number += rollDice();
  }
  return number;
}

// Generate password with specified word count
function generatePassword(wordCount) {
  if (!wordMap || Object.keys(wordMap).length === 0) {
    alert("Wordlist not loaded yet. Please wait or refresh the page.");
    return;
  }
  if (Object.keys(wordMap).length < 7776) {
    alert(
      `Wordlist is incomplete. Only ${
        Object.keys(wordMap).length
      } words loaded. Expected 7776.`
    );
    return;
  }

  console.log(`Generating password with ${wordCount} words`);
  const passwordWords = [];
  for (let i = 0; i < wordCount; i++) {
    const number = generateNumber();
    console.log(`Generated number: ${number}`);
    const word = wordMap[number];
    if (word) {
      console.log(`Found word: ${word}`);
      passwordWords.push(word);
    } else {
      console.warn(`Word not found for number: ${number}`);
      const retryNumber = generateNumber();
      console.log(`Retry number: ${retryNumber}`);
      const retryWord = wordMap[retryNumber];
      if (retryWord) {
        console.log(`Found retry word: ${retryWord}`);
        passwordWords.push(retryWord);
      } else {
        console.error(`Word not found for fallback number: ${retryNumber}`);
        passwordWords.push("[MISSING]");
      }
    }
  }
  const password = passwordWords.join(" ");
  console.log(`Generated password: ${password}`);
  displayPassword(password);
}

// Display the generated password with typing animation
async function displayPassword(password) {
  const passwordDisplay = document.getElementById("passwordDisplay");
  const passwordText =
    document.getElementById("passwordText") || document.createElement("span");
  passwordText.id = "passwordText";
  console.log(`Displaying password: ${password}`);

  if (password) {
    // If there's existing content, delete it with animation
    const existingChars = passwordText.querySelectorAll(
      ".password-char, .password-space"
    );
    if (existingChars.length > 0) {
      // Add deleting class to all existing characters
      existingChars.forEach((char, index) => {
        setTimeout(() => {
          char.classList.add("deleting");
        }, index * 25);
      });

      // Wait for deletion animation to complete
      await new Promise((resolve) =>
        setTimeout(resolve, existingChars.length * 25 + 100)
      );
    }

    // Clear previous content
    passwordText.textContent = "";

    if (!passwordText.parentNode) {
      passwordDisplay.insertBefore(passwordText, passwordDisplay.firstChild);
    }

    // Show the container with animation if it's not already visible
    if (!passwordDisplay.classList.contains("visible")) {
      passwordDisplay.style.display = "flex";
      // Force reflow
      passwordDisplay.offsetHeight;
      passwordDisplay.classList.add("visible");
      // Wait for container animation
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Split password into characters and create spans
    const characters = password.split("");
    let delay = 0;
    const baseDelay = 50; // Adjust this value to control typing speed

    // Create and append all spans first
    characters.forEach((char, index) => {
      const span = document.createElement("span");

      if (char === " ") {
        span.className = "password-space";
        span.innerHTML = "&nbsp;";
      } else {
        span.className = "password-char";
        span.textContent = char;
      }

      passwordText.appendChild(span);
    });

    // Animate each character
    const spans = passwordText.children;
    for (let i = 0; i < spans.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, baseDelay));
      spans[i].classList.add("typing");
    }

    // Reset and show copy button
    const existingCopyBtn = passwordDisplay.querySelector("#copyBtn");
    if (existingCopyBtn) {
      existingCopyBtn.remove();
    }

    // Add copy button after typing animation
    await new Promise((resolve) => setTimeout(resolve, 200));

    const copyBtn = document.createElement("button");
    copyBtn.id = "copyBtn";
    copyBtn.innerHTML = `
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
          <path d="M 11 2 C 9.895 2 9 2.895 9 4 L 9 20 C 9 21.105 9.895 22 11 22 L 24 22 C 25.105 22 26 21.105 26 20 L 26 8.5 C 26 8.235 25.895031 7.9809687 25.707031 7.7929688 L 20.207031 2.2929688 C 20.019031 2.1049687 19.765 2 19.5 2 L 11 2 z M 19 3.9042969 L 24.095703 9 L 20 9 C 19.448 9 19 8.552 19 8 L 19 3.9042969 z M 6 7 C 4.895 7 4 7.895 4 9 L 4 25 C 4 26.105 4.895 27 6 27 L 19 27 C 20.105 27 21 26.105 21 25 L 21 24 L 11 24 C 8.794 24 7 22.206 7 20 L 7 7 L 6 7 z"></path>
      </svg>
      <svg class="checkmark-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
          <path d="M14.147,19.267c-0.188,0.188-0.442,0.293-0.707,0.293s-0.52-0.105-0.707-0.293L9.28,15.814 c-0.391-0.391-0.391-1.023,0-1.414c0.391-0.391,1.023-0.391,1.414,0l2.746,2.746L25.674,4.911C25.318,4.364,24.702,4,24,4H6 C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V7.414L14.147,19.267z"></path>
      </svg>
    `;
    copyBtn.addEventListener("click", handleCopyClick);
    passwordDisplay.appendChild(copyBtn);

    // Force reflow
    copyBtn.offsetHeight;
    copyBtn.classList.add("visible");
  } else {
    // Hide with animation
    if (passwordDisplay.classList.contains("visible")) {
      passwordDisplay.classList.remove("visible");
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    passwordDisplay.style.display = "none";
    passwordText.textContent = "";
  }
}

// Event listeners for word count buttons
document.querySelectorAll(".word-count-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".word-count-btn.active").classList.remove("active");
    btn.classList.add("active");
    console.log(`Selected word count: ${btn.getAttribute("data-words")}`);
  });
});

// Event listener for Generate button
document.getElementById("generateBtn").addEventListener("click", () => {
  console.log("Generate button clicked");
  const activeBtn = document.querySelector(".word-count-btn.active");
  if (!activeBtn) {
    console.error("No active word count button found");
    alert("Please select a word count before generating a password.");
    return;
  }
  const wordCount = parseInt(activeBtn.getAttribute("data-words"), 10);
  if (isNaN(wordCount) || wordCount < 3 || wordCount > 8) {
    console.error("Invalid word count:", wordCount);
    alert("Invalid word count selected. Please select 3 to 8 words.");
    return;
  }
  console.log("Selected word count:", wordCount);
  generatePassword(wordCount);
});

// Event listener for Copy button with smooth transition
function handleCopyClick() {
  const passwordText = document.getElementById("passwordText");
  const password = passwordText.textContent.trim();
  if (!password || password.includes("Click Generate")) {
    alert("No password to copy. Please generate a password first.");
    return;
  }

  const copyBtn = document.getElementById("copyBtn");
  copyBtn.classList.add("copied");

  navigator.clipboard
    .writeText(password)
    .then(() => {
      console.log("Password copied to clipboard");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy password:", err);
      alert("Failed to copy password. Please select and copy manually.");
      copyBtn.classList.remove("copied");
    });
}

// Initial setup: Ensure no copy button and hide password display on page load
document.addEventListener("DOMContentLoaded", () => {
  const passwordDisplay = document.getElementById("passwordDisplay");
  const existingCopyBtn = passwordDisplay.querySelector("#copyBtn");
  if (existingCopyBtn) {
    existingCopyBtn.remove();
  }
  const passwordText = document.createElement("span");
  passwordText.id = "passwordText";

  passwordDisplay.appendChild(passwordText);
  passwordDisplay.style.display = "none";
  console.log("Page loaded, password display hidden");
});
