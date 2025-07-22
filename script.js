const App = () => {
    const [language, setLanguage] = React.useState('en');
    const [chatbotVisible, setChatbotVisible] = React.useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'mugen' : 'en');
    };

    const handleChatbotToggle = () => {
        setChatbotVisible(!chatbotVisible);
    };

    return (
        <div>
            <Header
                toggleLanguage={toggleLanguage}
                language={language}
                onChatbotToggle={handleChatbotToggle}
            />
            <Main language={language} />
            {chatbotVisible && <Chatbot mainRef={mainRef} />}
        </div>
    );
};

const mainRef = React.createRef();

const Header = ({ toggleLanguage, language, onChatbotToggle }) => {
    const translations = {
        en: {
            stream: 'Stream',
            posts: 'Posts',
            videos: 'Videos',
            quests: 'Quests',
            upgrades: 'Upgrades',
        },
        mugen: {
            stream: 'La-Ma',
            posts: 'Vir-Ma',
            videos: 'La-Vir',
            quests: 'Ma-La',
            upgrades: 'Vir-La',
        },
    };

    return (
        <header>
            <div className="logo">M</div>
            <nav>
                <a href="#">{translations[language].stream}</a>
                <a href="#">{translations[language].posts}</a>
                <a href="#">{translations[language].videos}</a>
                <a href="#">{translations[language].quests}</a>
                <a href="#">{translations[language].upgrades}</a>
            </nav>
            <div className="header-right">
                <button onClick={toggleLanguage}>
                    {language === 'en' ? 'MugenLingua' : 'English'}
                </button>
                <div className="chatbot-icon" onClick={onChatbotToggle}>
                    🤖
                </div>
            </div>
        </header>
    );
};

const Main = () => {
    const [videos, setVideos] = React.useState([]);
    const [selectedVideo, setSelectedVideo] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('Stream');

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        const videoName = prompt("Enter a name for your video:");
        if (file && videoName) {
            const newVideo = {
                name: videoName,
                url: URL.createObjectURL(file),
            };
            setVideos([...videos, newVideo]);
            setSelectedVideo(newVideo);
        }
    };

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
    };

    const findVideos = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        return videos.filter(video => video.name.toLowerCase().includes(lowerCaseQuery));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Stream':
                return (
                    <div className="stream-container">
                        <VideoPlayer video={selectedVideo} />
                        <Chat />
                    </div>
                );
            case 'Posts':
                return <div>Posts Content</div>;
            case 'Videos':
                return <VideoList videos={videos} onVideoSelect={handleVideoSelect} />;
            case 'Quests':
                return <div>Quests Content</div>;
            case 'Upgrades':
                return <div>Upgrades Content</div>;
            default:
                return null;
        }
    };

    return (
        <main>
            <div className="upload-section">
                <input type="file" accept="video/*" onChange={handleVideoUpload} />
            </div>
            <nav className="tabs">
                <button onClick={() => setActiveTab('Stream')}>Stream</button>
                <button onClick={() => setActiveTab('Posts')}>Posts</button>
                <button onClick={() => setActiveTab('Videos')}>Videos</button>
                <button onClick={() => setActiveTab('Quests')}>Quests</button>
                <button onClick={() => setActiveTab('Upgrades')}>Upgrades</button>
            </nav>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </main>
    );
};

const VideoPlayer = ({ video }) => {
    const [liked, setLiked] = React.useState(false);

    React.useEffect(() => {
        if (video) {
            const likedVideos = JSON.parse(localStorage.getItem('likedVideos')) || [];
            setLiked(likedVideos.includes(video.name));
        }
    }, [video]);

    const handleLike = () => {
        if (video) {
            const likedVideos = JSON.parse(localStorage.getItem('likedVideos')) || [];
            if (!likedVideos.includes(video.name)) {
                likedVideos.push(video.name);
                localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
                setLiked(true);
            }
        }
    };

    if (!video) {
        return <div className="video-player">Select a video to play</div>;
    }

    return (
        <div className="video-player">
            <video src={video.url} controls width="100%"></video>
            <div className="video-info">
                <h2>{video.name}</h2>
                <div className="video-actions">
                    <button onClick={handleLike} disabled={liked}>
                        {liked ? 'Liked' : 'Like'}
                    </button>
                    <button>Share</button>
                </div>
            </div>
            <Comments video={video} />
        </div>
    );
};

const Chat = () => {
    return (
        <div className="chat">
            <h3>Chat</h3>
            <div className="chat-messages"></div>
            <input type="text" placeholder="Say something..." />
        </div>
    );
};

const VideoList = ({ videos, onVideoSelect }) => {
    return (
        <div className="video-list">
            <h3>Up Next</h3>
            {videos.map((video, index) => (
                <div key={index} className="video-item" onClick={() => onVideoSelect(video)}>
                    <span>{video.name}</span>
                </div>
            ))}
        </div>
    );
};

const Comments = ({ video }) => {
    const [comments, setComments] = React.useState([]);
    const [newComment, setNewComment] = React.useState('');

    React.useEffect(() => {
        if (video) {
            const allComments = JSON.parse(localStorage.getItem('comments')) || {};
            setComments(allComments[video.name] || []);
        }
    }, [video]);

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        if (video && newComment) {
            const allComments = JSON.parse(localStorage.getItem('comments')) || {};
            const videoComments = allComments[video.name] || [];
            videoComments.push(newComment);
            allComments[video.name] = videoComments;
            localStorage.setItem('comments', JSON.stringify(allComments));
            setComments(videoComments);
            setNewComment('');
        }
    };

    return (
        <div className="comments">
            <h3>Comments</h3>
            <div className="comment-list">
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        {comment}
                    </div>
                ))}
            </div>
            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit">Comment</button>
            </form>
        </div>
    );
};

const Chatbot = ({ mainRef }) => {
    const [messages, setMessages] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            const newMessages = [...messages, { text: inputValue, sender: 'user' }];
            setMessages(newMessages);
            setInputValue('');
            // Simple bot response logic
            setTimeout(() => {
                const botResponse = getBotResponse(inputValue);
                setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
            }, 500);
        }
    };

    const getBotResponse = (userInput) => {
        const lowerCaseInput = userInput.toLowerCase();
        if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
            return 'Hello there! How can I help you today?';
        } else if (lowerCaseInput.includes('how to upload')) {
            return 'You can upload a video by clicking the "Choose File" button above the tabs.';
        } else if (lowerCaseInput.startsWith('remind me to')) {
            const reminder = userInput.substring('remind me to'.length).trim();
            setTimeout(() => {
                alert(`Reminder: ${reminder}`);
            }, 10000); // 10 seconds for demonstration
            return `I will remind you to "${reminder}" in 10 seconds.`;
        } else if (lowerCaseInput.startsWith('find videos about')) {
            const query = lowerCaseInput.substring('find videos about'.length).trim();
            const results = mainRef.current.findVideos(query);
            if (results.length > 0) {
                return `I found ${results.length} video(s) about "${query}".`;
            } else {
                return `I couldn't find any videos about "${query}".`;
            }
        } else {
            return "I'm sorry, I don't understand that. Can you please rephrase?";
        }
    };

    return (
        <div className="chatbot">
            <div className="chatbot-header">
                <h3>MugenBot</h3>
            </div>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
