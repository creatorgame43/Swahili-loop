// Swahili Loop - Main JavaScript

// User Management
class User {
    constructor(name, username, email) {
        this.id = Date.now();
        this.name = name;
        this.username = username;
        this.email = email;
        this.avatar = this.generateAvatar();
        this.followers = [];
        this.following = [];
        this.videos = [];
        this.likes = [];
    }
    
    generateAvatar() {
        const emojis = ['⚽', '💃', '😂', '🎵', '🍽️', '🎨', '🚀', '⚡'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
}

// Video Management
class Video {
    constructor(userId, title, description, tags) {
        this.id = Date.now();
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.fireCount = 0;
        this.comments = [];
        this.shares = 0;
        this.createdAt = new Date();
    }
}

// Gift System
const gifts = {
    'diamond': { icon: '💎', price: 1000, bonus: 500 },
    'crown': { icon: '👑', price: 500, bonus: 250 },
    'rose': { icon: '🌹', price: 100, bonus: 50 }
};

// Local Storage Management
const DB = {
    saveUser: (user) => localStorage.setItem('user_' + user.id, JSON.stringify(user)),
    getUser: (id) => JSON.parse(localStorage.getItem('user_' + id)),
    saveVideo: (video) => localStorage.setItem('video_' + video.id, JSON.stringify(video)),
    getVideo: (id) => JSON.parse(localStorage.getItem('video_' + id)),
    getAllVideos: () => {
        const videos = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('video_')) {
                videos.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return videos;
    }
};

// Animation Effects
function createFireAnimation() {
    const fire = document.createElement('div');
    fire.innerHTML = '🔥';
    fire.style.position = 'fixed';
    fire.style.fontSize = '30px';
    fire.style.animation = 'firefly 1s ease-out forwards';
    fire.style.pointerEvents = 'none';
    document.body.appendChild(fire);
    setTimeout(() => fire.remove(), 1000);
}

// API Routes
const API = {
    auth: {
        register: async (email, password, name) => {
            const user = new User(name, '@' + name.toLowerCase(), email);
            DB.saveUser(user);
            return { success: true, user };
        },
        login: async (email, password) => {
            // Simulate login
            return { success: true, message: 'Logged in successfully' };
        },
        logout: () => {
            localStorage.removeItem('currentUser');
        }
    },
    
    videos: {
        upload: async (title, description, tags) => {
            const currentUserId = localStorage.getItem('currentUserId');
            const video = new Video(currentUserId, title, description, tags);
            DB.saveVideo(video);
            return { success: true, video };
        },
        getAll: () => {
            return DB.getAllVideos().sort((a, b) => b.createdAt - a.createdAt);
        },
        addFire: (videoId) => {
            const video = DB.getVideo(videoId);
            if (video) {
                video.fireCount++;
                DB.saveVideo(video);
            }
            return { success: true };
        },
        comment: (videoId, text) => {
            const video = DB.getVideo(videoId);
            if (video) {
                video.comments.push({
                    id: Date.now(),
                    text,
                    createdAt: new Date()
                });
                DB.saveVideo(video);
            }
            return { success: true };
        }
    },
    
    gifts: {
        send: async (videoId, giftType, amount) => {
            const gift = gifts[giftType];
            if (gift) {
                return {
                    success: true,
                    message: `Hadiahi ${gift.icon} ilitumwa!`,
                    bonus: gift.bonus
                };
            }
            return { success: false };
        }
    },
    
    social: {
        follow: async (userId) => {
            return { success: true, message: 'Unafuata sasa!' };
        },
        unfollow: async (userId) => {
            return { success: true, message: 'Hauwezi tena!' };
        },
        share: async (videoId, platform) => {
            return {
                success: true,
                message: `Video imeshirikiwa kwenye ${platform}!`
            };
        }
    }
};

// UI Controllers
const UI = {
    showNotification: (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#ff0050' : '#ff6b35'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    },
    
    updateFeedCount: (count) => {
        console.log(`📊 ${count} videos loaded!`);
    }
};

// Add CSS for animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes firefly {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-80px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🔥 Swahili Loop initialized successfully!');
