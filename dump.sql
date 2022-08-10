CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4 (),
    name varchar(255),
    phone_number varchar(255) not null,
    profile_picture_key varchar(255),
    cognito_id varchar(255),
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(user_id)
);


CREATE TABLE user_devices (
    user_device_id uuid DEFAULT uuid_generate_v4 (),
    user_id  uuid not null,
    device_id varchar(255) not null,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(user_id)
);

CREATE TABLE spaces (
    space_id uuid DEFAULT uuid_generate_v4 (),
    name varchar(255) not null,
    description varchar(255),
    picture_key varchar(255),
    approval_percentage integer not null,
    participation_percentage integer not null,
    owner_id uuid not null,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(space_id),
    FOREIGN KEY(owner_id) REFERENCES users(user_id)
);

CREATE TABLE members (
    member_id uuid DEFAULT uuid_generate_v4 (),
    space_id uuid not null,
    user_id uuid not null,
    invitation_status integer,
    role varchar(30) not null,
    name varchar(255),
    expired_at TIMESTAMP WITH TIME ZONE,
    deleted boolean DEFAULT false,
    created_by uuid not null,
    updated_by uuid not null,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(member_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TABLE cache (
    cache_id uuid DEFAULT uuid_generate_v4 (),
    user_id uuid  NOT NULL,
    entity_name varchar(255),
    event_name varchar(255),
    data text,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(cache_id)
);


CREATE TABLE manifesto (
    manifesto_id uuid DEFAULT uuid_generate_v4 (),
    title varchar(255),
    content text,
    option_type integer not null,
    space_id uuid not null,
    created_by uuid not null,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_by uuid not null,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(manifesto_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TABLE manifesto_option (
    manifesto_option_id uuid DEFAULT uuid_generate_v4 (),
    title varchar(255) not null,
    manifesto_id uuid not null,
    deleted boolean DEFAULT false,
    created_by uuid not null,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_by uuid not null,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(manifesto_option_id),
    FOREIGN KEY(manifesto_id) REFERENCES manifesto(manifesto_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TABLE proposal (
    proposal_id uuid DEFAULT uuid_generate_v4 (),
    manifesto_id uuid not null,
    status integer not null,
    progress_status integer not null default 0,
    space_id uuid not null,
    expired_at varchar(255),
    insufficient_votes boolean,
    created_by uuid not null,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_by uuid not null,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    approval_percentage integer not null,
    participation_percentage integer not null,
	PRIMARY KEY(proposal_id),
    FOREIGN KEY(manifesto_id) REFERENCES manifesto(manifesto_id),
    FOREIGN KEY(created_by) REFERENCES users(user_id),
    FOREIGN KEY(updated_by) REFERENCES users(user_id)
);

CREATE TABLE proposal_participation (
    proposal_participation_id uuid DEFAULT uuid_generate_v4 (),
    proposal_id uuid not null,
    user_id uuid not null,
    member_id uuid not null,
    space_id uuid not null,
    participated boolean default false,
	PRIMARY KEY(proposal_participation_id),
    FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(member_id) REFERENCES members(member_id),
    FOREIGN KEY(space_id) REFERENCES spaces(space_id)
);


CREATE TABLE proposal_vote (
    proposal_vote_id uuid DEFAULT uuid_generate_v4 (),
    proposal_id uuid not null,
    user_hash varchar(255) not null,
    manifesto_option_id uuid,
    in_favor boolean,
    null_vote_comment text,
    created_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(proposal_vote_id),
    FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id),
    FOREIGN KEY(manifesto_option_id) REFERENCES manifesto_option(manifesto_option_id)
);

CREATE TABLE manifesto_comment (
    manifesto_comment_id uuid DEFAULT uuid_generate_v4 (),
    content text,
    manifesto_comment_parent_id uuid,
    deleted boolean DEFAULT false,
    created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
    created_by_member uuid not null,
    updated_at timestamp with time zone  not null default CURRENT_TIMESTAMP,
    manifesto_id uuid not null,
	PRIMARY KEY(manifesto_comment_id),
    FOREIGN KEY(manifesto_comment_parent_id) REFERENCES manifesto_comment(manifesto_comment_id),
    FOREIGN KEY(created_by_member) REFERENCES members(member_id),
    FOREIGN KEY(manifesto_id) REFERENCES manifesto(manifesto_id)
);

CREATE TABLE manifesto_comment_vote (
    manifesto_comment_vote_id uuid DEFAULT uuid_generate_v4 (),
    manifesto_comment_id uuid not null,
    user_id uuid not null,
    upvote boolean DEFAULT false,
    created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
	PRIMARY KEY(manifesto_comment_vote_id),
    FOREIGN KEY(manifesto_comment_id) REFERENCES manifesto_comment(manifesto_comment_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);


INSERT INTO users(user_id, name, phone_number, cognito_id) VALUES('$PRIMARY_USER__USER_ID', 'Alex Ortega', '+526626666666', '$PRIMARY_USER__COGNITO_ID');

INSERT INTO spaces(space_id, name, description, approval_percentage, participation_percentage, owner_id) values('$REPRESENTATIVE_SPACE_ID', 'Test Space', 'This a space for testing', 70, 70, '$PRIMARY_USER__USER_ID');

INSERT INTO members(member_id, space_id, user_id, invitation_status, role, created_by, updated_by) 
    values ('$REPRESENTATIVE_MEMBER_ID', '$REPRESENTATIVE_SPACE_ID', '$PRIMARY_USER__USER_ID', 2, 'REPRESENTATIVE', '$PRIMARY_USER__USER_ID', '$PRIMARY_USER__USER_ID')