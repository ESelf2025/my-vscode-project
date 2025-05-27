// src/pages/emotionToScript.js

export function generateScript(emotion, name) {
    if (emotion === "lonely") {
      return `Hey ${name}, I’m David. I know what it’s like to feel lonely. When I was a shepherd, I often felt alone. But I learned that God was with me—even when no one else was. You're not alone either. God sees you.`;
    }
  
    if (emotion === "afraid") {
      return `Hi ${name}, I’m Esther. I had to stand in front of a king and I was so afraid. But God gave me the courage I needed. He will give you courage too. You are braver than you feel.`;
    }
  
    if (emotion === "sad") {
      return `Hi ${name}, I’m Jeremiah. I cried a lot in my life, but God still gave me strength to keep going. It’s okay to feel sad. God understands, and He’s with you.`;
    }
  
    if (emotion === "not enough") {
      return `Hey ${name}, I’m Moses. I told God I wasn’t good enough to lead. I even stuttered when I talked. But God still chose me—and He chooses you too. You are enough.`;
    }
  
    return `Hi ${name}, I’m someone from the Bible who cares. Whatever you're feeling, God sees it. He loves you so much. Keep going—you’re not alone.`;
  }
  