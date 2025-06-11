package com.interview_tracker.Entity;

public class Progress {

	int id;
	User user; // Many-to-one
	Question question; // Many-to-one
	String status; // Not Started / In Progress / Completed
	String note; // User’s answer or personal notes

	// -----------------------------------------------------------------------------

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	// ---------------------------------------------------------------------------------
	public Progress() {
		// TODO Auto-generated constructor stub
	}

	public Progress(int id, User user, Question question, String status, String note) {
		super();
		this.id = id;
		this.user = user;
		this.question = question;
		this.status = status;
		this.note = note;
	}

}
