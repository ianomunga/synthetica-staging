-- Users Table
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255)
);

-- Models Table
CREATE TABLE models (
    model_name VARCHAR(255) PRIMARY KEY,
    status VARCHAR(10) CHECK (status IN ('Active', 'Inactive')),
    last_updated DATE,
    metadata VARBINARY(MAX),
    eval_metrics NVARCHAR(MAX),
    data_filters NVARCHAR(MAX)
);

-- User_Models Table (for many-to-many relationship)
CREATE TABLE user_models (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(255),
    model_name VARCHAR(255),
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (model_name) REFERENCES models(model_name)
);