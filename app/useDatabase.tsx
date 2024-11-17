import { useState, useEffect } from "react";
import * as db from "./database";

export const useDatabase = () => {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    db.setupDatabase()
      .then(() => {
        setIsDbReady(true);
      })
      .catch((error) => console.error("Error setting up database:", error));
  }, []);

  return {
    isDbReady,
    createQuiz: db.createQuiz,
    getQuizzes: db.getQuizzes,
    updateQuiz: db.updateQuiz,
    deleteQuiz: db.deleteQuiz,
    getQuestions: db.getQuestions,
    addQuestion: db.addQuestion,
    addMultipleQuestion: db.addMultipleQuestion,
    updateQuestion: db.updateQuestion,
    deleteQuestion: db.deleteQuestion,
  };
};
