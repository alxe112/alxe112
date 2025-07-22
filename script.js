const App = () => {
    const [language, setLanguage] = React.useState('en');

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'mugen' : 'en');
    };

    return (
        <div>
            <Header toggleLanguage={toggleLanguage} language={language} />
            <Main language={language} />
        </div>
    );
};

const Header = ({ toggleLanguage, language }) => {
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
            <button onClick={toggleLanguage}>
                {language === 'en' ? 'MugenLingua' : 'English'}
            </button>
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

ReactDOM.render(<App />, document.getElementById('root'));
