package com.interview_tracker.Entity;

public class Question {

	int id;
	String questionText; // The interview question
	String hint; // Tip or explanation (optional)
	String difficulty; // Easy / Medium / Hard
	String category; // Many-to-one relationship
	User createdBy; // Admin who added it
	
	
	// ------------------------------------------------------------------------------

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getQuestionText() {
		return questionText;
	}

	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}

	public String getHint() {
		return hint;
	}

	public void setHint(String hint) {
		this.hint = hint;
	}

	public String getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(String difficulty) {
		this.difficulty = difficulty;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	
	// ------------------------------------------------------------------------------

	public Question() {
		// TODO Auto-generated constructor stub
	}

	public Question(int id, String questionText, String hint, String difficulty, String category, User createdBy) {
		super();
		this.id = id;
		this.questionText = questionText;
		this.hint = hint;
		this.difficulty = difficulty;
		this.category = category;
		this.createdBy = createdBy;
	}

}
