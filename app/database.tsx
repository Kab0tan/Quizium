// database.js
import * as SQLite from "expo-sqlite";

// Open or create database
const db = SQLite.openDatabaseSync("quizzes.db");

// Initialize database tables
export const setupDatabase = () => {
  return new Promise((resolve, reject) => {
    db.withExclusiveTransactionAsync(async () => {
      // // Drop existing tables (order matters due to foreign key)
      // await db.execAsync("DROP TABLE IF EXISTS questions;");
      // await db.execAsync("DROP TABLE IF EXISTS quizzes;");
      // Create quizzes table
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS quizzes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT
        );`
      );

      // Create questions table
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          quiz_id INTEGER,
          question_text TEXT NOT NULL,
          correct_answer TEXT NOT NULL,
          options TEXT NOT NULL,
          FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
        );`
      );

      resolve("Database setup completed successfully");
    });
  })
    .then((value) => {
      console.log("Promise resolved with value: " + value);
    })
    .catch((error) => {
      console.error("Promise rejected with error: " + error);
    });
};

// Quiz CRUD Operations


export const createQuiz = async (title: string, description: string) => {
  const result = await db.runAsync(
    "INSERT INTO quizzes (title, description) VALUES (?, ?)",
    title,
    description
  );
  console.log("Quiz added in quizzes table: " + result.lastInsertRowId);
  return result.lastInsertRowId;
};

export const getQuizzes = () => {
  return new Promise((resolve, reject) => {
    db.withTransactionAsync(async () => {
      const quizzes = await db.getAllAsync("SELECT * FROM quizzes");
      resolve(quizzes);
    });
  })
    .then((value) => {
      return value;
    })
    .catch((error) => {
      console.error("Quizzes not fetched from quizzes table: " + error);
      throw error;
    });
};

export const updateQuiz = (id: number, title: string, description: string) => {
  return new Promise((resolve, reject) => {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        "UPDATE quizzes SET title = ?, description = ? WHERE id = ?",
        [title, description, id]
      );
      resolve("Quiz updated successfully");
    });
  });
};

export const deleteQuiz = (id: number) => {
  return new Promise((resolve, reject) => {
    db.withTransactionAsync(async () => {
      // First delete related questions
      await db.runAsync("DELETE FROM questions WHERE quiz_id = $id", {
        $id: id,
      });
      // Then delete the quiz
      await db.runAsync("DELETE FROM quizzes WHERE id = $id", { $id: id });

      resolve("Quiz deleted successfully");
    });
  })
    .then((value) => {
      console.log("Promise resolved with value: " + value);
    })
    .catch((error) => {
      console.error("Promise rejected with error: " + error);
    });
};

// Questions CRUD Operations
export const getQuestions = (quizId: number) => {
  return new Promise((resolve, reject) => {
    db.withTransactionAsync(async () => {
      const questions = await db.getAllAsync(
        "SELECT * FROM questions WHERE quiz_id = ?",
        quizId
      );
      resolve(questions);
    });
  })
    .then((value) => {
      return value;
    })
    .catch((error) => {
      console.error("Promise rejected with error: " + error);
    });
};


export const addQuestion = async (
  quizId: number,
  questionText: string,
  correctAnswer: string,
  options: string[]
): Promise<number> => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.withTransactionAsync(async () => {
        try {
          const result = await db.runAsync(
            "INSERT INTO questions (quiz_id, question_text, correct_answer, options) VALUES (?, ?, ?, ?)",
            quizId,
            questionText,
            correctAnswer,
            JSON.stringify(options)
          );
          resolve(result.lastInsertRowId);
        } catch (error) {
          reject(error);
        }
      });
    });
    return result as number;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};



export const updateQuestion = (
  id: number,
  question_text: string,
  correct_answer: string,
  options: string[]
) => {
  return new Promise((resolve, reject) => {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        "UPDATE questions SET question_text = ?, correct_answer = ?, options = ? WHERE id = ?",
        [question_text, correct_answer, JSON.stringify(options), id]
      );
      resolve("Question updated successfully");
    });
  });
};

export const deleteQuestion = (id: number) => {
  return new Promise((resolve, reject) => {
    db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM questions WHERE id = $id", { $id: id });

      resolve("Question deleted successfully");
    });
  })
    .then((value) => {
      console.log("Promise resolved with value: " + value);
    })
    .catch((error) => {
      console.error("Promise rejected with error: " + error);
    });
};
