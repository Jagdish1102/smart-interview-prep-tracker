package com.interview_tracker.Entity;

public class Category {
	int id;
	String name; // e.g., "Java", "DBMS", "HR"
	String discription; // (Optional) more details

	// --------------------------------------------------------------------------

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDiscription() {
		return discription;
	}
//------------------------------------------------------------------------------

	public void setDiscription(String discription) {
		this.discription = discription;
	}

	public Category() {
		// TODO Auto-generated constructor stub
	}

	public Category(int id, String name, String discription) {
		super();
		this.id = id;
		this.name = name;
		this.discription = discription;
	}

}

