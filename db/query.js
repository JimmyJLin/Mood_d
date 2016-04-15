select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name
from profile
left join emotion
on profile.emotion_id = emotion.emotion_id
left join activity
on profile.activity_id = activity.activity_id
order by profile.profile_id;


select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name
from profile
left join emotion
on profile.emotion_id = emotion.emotion_id
left join activity
on profile.activity_id = activity.activity_id
WHERE profile.profile_id = $1;

select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name from profile left join emotion on profile.emotion_id = emotion.emotion_id left join activity on profile.activity_id = activity.activity_id WHERE profile.profile_id = $1;

// login
SELECT *
FROM profile
WHERE email LIKE ($1)

// select one with sender & receiver name
select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name,  messages.receiver_name receiver, messages.message
from profile
left join emotion
on profile.emotion_id = emotion.emotion_id
left join activity
on profile.activity_id = activity.activity_id
left join messages
on profile.profile_id = messages.profile_id
WHERE profile.profile_id = $1

select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name,  messages.receiver_name receiver, messages.message from profile left join emotion on profile.emotion_id = emotion.emotion_id left join activity on profile.activity_id = activity.activity_id left join messages on profile.profile_id = messages.profile_id WHERE profile.profile_id = $1
//end

select profile.email, profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name
from profile
left join emotion
on profile.emotion_id = emotion.emotion_id
left join activity
on profile.activity_id = activity.activity_id
WHERE profile.email LIKE ($1)


select profile.email, profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name from profile left join emotion on profile.emotion_id = emotion.emotion_id left join activity on profile.activity_id = activity.activity_id WHERE profile.email LIKE ($1)

SELECT *
FROM profile
left join emotion
on profile.emotion_id = emotion.emotion_id
left join activity
on profile.activity_id = activity.activity_id
WHERE email LIKE ($1)

SELECT profile.email, profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name FROM profile left join emotion on profile.emotion_id = emotion.emotion_id left join activity on profile.activity_id = activity.activity_id WHERE email LIKE ($1)


// insert
INSERT
INTO profile( email, password_digest, name) VALUES ($1, $2, $3)

// insert with join table
INSERT INTO messages (profile_id, message) VALUES ($1, $2) WHERE
