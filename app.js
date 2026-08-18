const videoA = document.querySelector("#videoA");
const videoB = document.querySelector("#videoB");

const playButton = document.querySelector("#playButton");
const muteButton = document.querySelector("#muteButton");
const volumeSlider = document.querySelector("#volumeSlider");
const volumeValue = document.querySelector("#volumeValue");

const sceneTitle = document.querySelector("#sceneTitle");
const sceneDescription = document.querySelector("#sceneDescription");
const sceneInfo = document.querySelector(".scene-info");

const sceneButtons = document.querySelectorAll(".scene");

// =====================================================
// SCENE VARIANTS
// =====================================================

const sceneVariants = {

    rain: {

        heavy: {
            label: "HEAVY",
            subtitle: "сильный дождь",
            title: "HEAVY RAIN",
            description: "сильный дождь · плотный шум воды",
            video: "assets/video/optimized/rain-heavy.mp4",
            audio: "assets/audio/mixkit-rain-in-the-jungle-and-birds-2431.wav"
        },

        thunder: {
            label: "THUNDER",
            subtitle: "дождь · гром",
            title: "THUNDER",
            description: "дождь · гром · гроза",
            video: "assets/video/optimized/rain-thunder.mp4",
            audio: "assets/audio/heavy-rain.mp3"
        },

        sea: {
            label: "SEA",
            subtitle: "дождь · море",
            title: "SEA RAIN",
            description: "дождь · море · волны",
            video: "assets/video/optimized/rain-sea.mp4",
            audio: "assets/audio/sea-rain.mp3"
        },

        window: {
    label: "WINDOW",
    subtitle: "дождь за окном",
    title: "WINDOW RAIN",
    description: "тихий дождь · уют · окно",
    video: "assets/video/optimized/rain-window.mp4",
    audio: "assets/audio/window-rain.mp3"
}

    },

    city: {

        night: {
            label: "NIGHT",
            subtitle: "ночной город",
            title: "NIGHT CITY",
            description: "ночной город · огни · атмосфера",
            video: "assets/video/optimized/city-night.mp4",
            audio: "assets/audio/city-night.mp3"
},

        traffic: {
    label: "TRAFFIC",
    subtitle: "улицы · машины",
    title: "CITY TRAFFIC",
    description: "город · движение · шум улиц",
    video: "assets/video/optimized/city-traffic.mp4",
    audio: "assets/audio/city-traffic-loop2.wav"
},

        rooftop: {
            label: "ROOFTOP",
            subtitle: "город с высоты",
            title: "ROOFTOP",
            description: "высота · город · далёкий шум",
            video: "assets/video/optimized/city-rooftop.mp4",
            audio: "assets/audio/city-rooftop.mp3"
},

        late: {
            label: "LATE NIGHT",
            subtitle: "город после полуночи",
            title: "LATE NIGHT",
            description: "ночь · редкие машины · тишина",
            video: "assets/video/optimized/city-late-night.mp4",
            audio: "assets/audio/city-late-night.mp3"
        }

    },

    forest: {

        deep: {
            label: "DEEP",
            subtitle: "глубокий лес",
            title: "DEEP FOREST",
            description: "лес · природа · спокойствие",
            video: "assets/video/optimized/forest-deep.mp4",
            audio: "assets/audio/forest-deep.mp3"
        },

        birds: {
            label: "BIRDS",
            subtitle: "пение птиц",
            title: "FOREST BIRDS",
            description: "лес · птицы · утро",
            video: "assets/video/optimized/forest-birds.mp4",
            audio: "assets/audio/forest-birds.mp3"
        },

        wind: {
            label: "WIND",
            subtitle: "ветер в деревьях",
            title: "FOREST WIND",
            description: "деревья · ветер · природа",
            video: "assets/video/optimized/forest-wind.mp4",
            audio: "assets/audio/forest-wind.mp3"
        },

        creek: {
            label: "CREEK",
            subtitle: "лесной ручей",
            title: "FOREST CREEK",
            description: "лес · ручей · спокойствие",
            video: "assets/video/optimized/forest-creek.mp4",
            audio: "assets/audio/forest-creek.mp3"
        }

    },

    ocean: {

        waves: {
            label: "WAVES",
            subtitle: "мягкие волны",
            title: "OCEAN WAVES",
            description: "море · волны · спокойствие",
            video: "assets/video/optimized/ocean-waves.mp4",
            audio: "assets/audio/ocean-waves.mp3"
        },

        shore: {
            label: "SHORE",
            subtitle: "волны у берега",
            title: "OCEAN SHORE",
            description: "берег · море · волны",
            video: "assets/video/optimized/ocean-shore.mp4",
            audio: "assets/audio/ocean-shore.mp3"
        },

        storm: {
            label: "STORM",
            subtitle: "штормовое море",
            title: "OCEAN STORM",
            description: "море · ветер · сильные волны",
            video: "assets/video/optimized/ocean-storm.mp4",
            audio: "assets/audio/ocean-storm.mp3"
        },

        night: {
            label: "NIGHT",
            subtitle: "ночной океан",
            title: "NIGHT OCEAN",
            description: "ночь · море · тёмные волны",
            video: "assets/video/optimized/ocean-night.mp4",
            audio: "assets/audio/ocean-night.mp3"
        }

    }

};

// =====================================================
// STATE
// =====================================================

let currentVideo = videoA;
let nextVideo = videoB;

let currentScene = "rain";

const currentVariants = {
    rain: "heavy",
    city: "night",
    forest: "deep",
    ocean: "waves"
};

let playing = false;

let currentAudio = null;

let transitionId = 0;

let audioVolume = 0.50;
let muted = false;
let videoTransitionTimer = null;

// =====================================================
// VOLUME CONTROLS
// =====================================================

function updateVolumeUI() {

    const percent = Math.round(audioVolume * 100);

    volumeSlider.value = audioVolume;

    volumeValue.textContent = `${percent}%`;

    if (muted || audioVolume === 0) {

        muteButton.textContent = "🔇";

    } else if (audioVolume < 0.35) {

        muteButton.textContent = "🔈";

    } else if (audioVolume < 0.7) {

        muteButton.textContent = "🔉";

    } else {

        muteButton.textContent = "🔊";

    }

}


volumeSlider.addEventListener(
    "input",
    async () => {

        audioVolume = Number(volumeSlider.value);

        muted = false;

        if (currentAudio) {

            currentAudio.volume = audioVolume;

        } else if (playing) {

            const scene = getCurrentSceneData();

            if (scene && scene.audio) {

                transitionId++;

                startSceneAudio(
                    scene.audio,
                    transitionId
                );

            }

        }

        updateVolumeUI();

    }
);


muteButton.addEventListener(
    "click",
    () => {

        muted = !muted;

        if (currentAudio) {

            currentAudio.volume =
                muted ? 0 : audioVolume;

        }

        updateVolumeUI();

    }
);


updateVolumeUI();
// =====================================================
// AUDIO
// =====================================================

// =====================================================
// AUDIO
// =====================================================

function createAudio(path) {

    const audio = new Audio(path);

    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";

    return audio;
}


function fadeAudio(
    audio,
    target,
    duration = 500,
    isValid = null
) {

    return new Promise(resolve => {

        if (!audio) {
            resolve();
            return;
        }

        const clamp = value =>
            Math.min(
                1,
                Math.max(
                    0,
                    Number(value) || 0
                )
            );


        target = clamp(target);

        const startVolume =
            clamp(audio.volume);

        const difference =
            target - startVolume;

        const startTime =
            performance.now();


        function step(now) {

            if (
                isValid &&
                !isValid()
            ) {

                resolve();
                return;

            }


            const progress =
                Math.min(
                    Math.max(
                        (now - startTime) /
                        duration,
                        0
                    ),
                    1
                );


            audio.volume =
                clamp(
                    startVolume +
                    difference * progress
                );


            if (progress < 1) {

                requestAnimationFrame(step);

            } else {

                audio.volume = target;

                resolve();

            }

        }


        requestAnimationFrame(step);

    });

}


async function stopCurrentAudio() {

    if (!currentAudio) {
        return;
    }

    const audio = currentAudio;

    currentAudio = null;

    audio.pause();

    try {
        audio.currentTime = 0;
    } catch (error) {}

    audio.volume = 0;

}


async function startSceneAudio(
    audioPath,
    id
) {

    if (
        !playing ||
        !audioPath
    ) {
        return;
    }


    // Старый звук выключаем сразу
    if (currentAudio) {

        const oldAudio =
            currentAudio;

        currentAudio = null;

        oldAudio.pause();

        try {
            oldAudio.currentTime = 0;
        } catch (error) {}

        oldAudio.volume = 0;

    }


    const audio =
        createAudio(audioPath);


    try {

        await audio.play();

    } catch (error) {

        return;

    }


    // Пока файл запускался,
    // пользователь мог выбрать другую сцену
    if (
        id !== transitionId ||
        !playing
    ) {

        audio.pause();

        try {
            audio.currentTime = 0;
        } catch (error) {}

        return;

    }


    currentAudio = audio;


    await fadeAudio(
        audio,
        muted ? 0 : audioVolume,
        450,
        () =>
            id === transitionId &&
            playing &&
            currentAudio === audio
    );


    // Если во время fade сцена уже сменилась
    if (
        id !== transitionId ||
        !playing ||
        currentAudio !== audio
    ) {

        audio.pause();

        try {
            audio.currentTime = 0;
        } catch (error) {}

        audio.volume = 0;

        if (currentAudio === audio) {
            currentAudio = null;
        }

    }

}

// =====================================================
// VIDEO
// =====================================================
const VIDEO_VERSION = 7;


function getVideoUrl(videoPath) {

    return `${videoPath}?v=${VIDEO_VERSION}`;

}
	
function switchVideo(videoPath) {

    const id = transitionId;

    const incoming = nextVideo;
    const outgoing = currentVideo;


    // Отменяем старый незавершённый переход
    if (videoTransitionTimer) {

        clearTimeout(videoTransitionTimer);

        videoTransitionTimer = null;

    }


    // Второй слой полностью скрываем
    // перед загрузкой нового видео
    incoming.pause();

    incoming.classList.remove("active");

    incoming.style.transition = "none";
    incoming.style.opacity = "0";
    incoming.style.visibility = "hidden";


    // НИКАКИХ скрытых preload-video.
    // Загружаем ролик непосредственно
    // в реальный видеослой.
    incoming.src =
        getVideoUrl(videoPath);

    incoming.load();


    const startPlayback = () => {

        if (id !== transitionId) {
            return;
        }


        // Не показываем первый чёрный кадр
        try {

            incoming.currentTime = 0.35;

        } catch (error) {}


        if (playing) {

            incoming
                .play()
                .catch(() => {});

        }


        incoming.classList.add("active");

        incoming.style.opacity = "0";
        incoming.style.visibility = "visible";


        // Принудительно применяем скрытое состояние
        void incoming.offsetWidth;


        incoming.style.transition = "";


        // Сразу фиксируем новый текущий слой
        currentVideo = incoming;
        nextVideo = outgoing;


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                if (id !== transitionId) {
                    return;
                }

                incoming.style.opacity = "1";

                outgoing.style.opacity = "0";

            });

        });


        videoTransitionTimer =
            setTimeout(() => {

                if (id !== transitionId) {
                    return;
                }

                outgoing.pause();

                outgoing.classList.remove(
                    "active"
                );

                outgoing.style.opacity = "0";

                outgoing.style.visibility =
                    "hidden";

                videoTransitionTimer = null;

            }, 700);

    };


    if (incoming.readyState >= 3) {

        startPlayback();

    } else {

        incoming.addEventListener(
            "canplay",
            startPlayback,
            { once: true }
        );

    }
}
// =====================================================
// CURRENT SCENE DATA
// =====================================================
const sceneRail =
    document.querySelector("#sceneRail");

const sceneRailTitle =
    sceneRail.querySelector(".scene-rail-title");

const variantButtons =
    Array.from(
        sceneRail.querySelectorAll(
            ".scene-rail-item[data-variant]"
        )
    );


function updateVariantRail() {

    const variants =
        sceneVariants[currentScene];

    if (!variants) {
        return;
    }

    sceneRailTitle.textContent =
        currentScene.toUpperCase();

    const entries =
        Object.entries(variants);

    variantButtons.forEach((button, index) => {

        const entry =
            entries[index];

        if (!entry) {
            button.style.display = "none";
            return;
        }

        button.style.display = "";

        const [variantName, variant] =
            entry;

        button.dataset.variant =
            variantName;

        const strong =
            button.querySelector("strong");

        const small =
            button.querySelector("small");

        strong.textContent =
            variant.label;

        small.textContent =
            variant.subtitle;

        button.classList.toggle(
            "active",
            currentVariants[currentScene] === variantName
        );

    });

}


function getCurrentSceneData() {

    const variants =
        sceneVariants[currentScene];

    const currentVariant =
        currentVariants[currentScene];

    if (
        variants &&
        variants[currentVariant]
    ) {

        return variants[currentVariant];

    }

    return variants
    ? Object.values(variants)[0]
    : null;

}

// =====================================================
// SCENE UI
// =====================================================

function updateSceneUI() {

    sceneButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.scene === currentScene
        );

    });

}
// =====================================================
// SCENE
// =====================================================

async function selectScene(sceneName) {

    if (!sceneVariants[sceneName])  {
        return;
    }

    if (sceneName === currentScene) {
        return;
    }

const scene =
    sceneVariants[sceneName]?.[
        currentVariants[sceneName]
    ];

if (!scene) {
    return;
}

    // Новый ID делает все предыдущие
    // переходы неактуальными.

    transitionId++;

    const id = transitionId;

 currentScene = sceneName;

localStorage.setItem(
    "scene",
    sceneName
);

// Обновляем активную сцену
updateSceneUI();

const activeSceneButton =
    document.querySelector(
        ".scene-selector button.active"
    );

if (activeSceneButton) {

    activeSceneButton.animate(
        [
            {
                filter: "brightness(0.8)",
                opacity: 0.7
            },
            {
                filter: "brightness(1.18)",
                opacity: 1
            },
            {
                filter: "brightness(1)",
                opacity: 1
            }
        ],
        {
            duration: 520,
            easing:
                "cubic-bezier(0.22, 1, 0.36, 1)"
        }
    );

}

/* Плавная смена левого меню */

sceneRail
    .getAnimations()
    .forEach(animation => {
        animation.cancel();
    });


const railOutAnimation =
    sceneRail.animate(
        [
            {
                opacity: 1,
                filter: "blur(0px)",
                transform: "translateY(-50%) translateX(0)"
            },
            {
                opacity: 0,
                filter: "blur(5px)",
                transform: "translateY(-50%) translateX(-8px)"
            }
        ],
        {
            duration: 180,
            easing: "ease-in",
            fill: "forwards"
        }
    );


railOutAnimation.finished
    .then(() => {

        /*
         * Если пользователь уже успел
         * выбрать другую сцену —
         * старый переход не продолжаем.
         */
        if (id !== transitionId) {
            return;
        }


        /* Теперь подменяем содержимое */
        updateVariantRail();


        /* И показываем уже новое меню */
        sceneRail.animate(
            [
                {
                    opacity: 0,
                    filter: "blur(5px)",
                    transform:
                        "translateY(-50%) translateX(8px)"
                },
                {
                    opacity: 1,
                    filter: "blur(0px)",
                    transform:
                        "translateY(-50%) translateX(0)"
                }
            ],
            {
                duration: 360,
                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "forwards"
            }
        );

    })
    .catch(() => {});

    // Сначала полностью останавливаем
    // старый звук.

switchVideo(scene.video);


updateText(scene);

if (playing && scene.audio) {

    startSceneAudio(
        scene.audio,
        id
    );

}

}

function updateText(scene) {

    // Уход старого текста
    sceneInfo.style.opacity = "0";
    sceneInfo.style.transform =
        "translateY(-8px) scale(0.985)";

    sceneTitle.style.filter = "blur(6px)";
    sceneDescription.style.filter = "blur(4px)";

    setTimeout(() => {

        // Меняем содержимое только после исчезновения
        sceneTitle.textContent = scene.title;
        sceneDescription.textContent = scene.description;

        // Начальная точка нового текста
        sceneInfo.style.transform =
            "translateY(8px) scale(0.985)";

        sceneTitle.style.filter = "blur(6px)";
        sceneDescription.style.filter = "blur(4px)";

        // Небольшая пауза создаёт ощущение
        // настоящего перехода между сценами
        requestAnimationFrame(() => {

            sceneInfo.style.opacity = "1";
            sceneInfo.style.transform =
                "translateY(0) scale(1)";

            sceneTitle.style.filter = "blur(0)";
            sceneDescription.style.filter = "blur(0)";

        });

    }, 380);

}
// =====================================================
// SCENE BUTTONS
// =====================================================

sceneButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectScene(
                button.dataset.scene
            );

        }
    );

});
// =====================================================
// SCENE VARIANTS
// =====================================================

variantButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const variant =
                button.dataset.variant;

            const variants =
                sceneVariants[currentScene];

            if (
                !variants ||
                !variants[variant]
            ) {
                return;
            }

            if (
                currentVariants[currentScene] === variant
            ) {
                return;
            }

            const data =
                variants[variant];

            currentVariants[currentScene] =
                variant;

            localStorage.setItem(
                `${currentScene}Variant`,
                variant
            );

            updateVariantRail();

            transitionId++;

            const id =
                transitionId;

            switchVideo(
                data.video
            );

            if (
                playing &&
                data.audio
            ) {

                startSceneAudio(
                    data.audio,
                    id
                );

            }

            updateText(
                data
            );

        }
    );

});

// =====================================================
// PLAY / PAUSE
// =====================================================

playButton.addEventListener(
    "click",
    async () => {

        if (playing) {

            playing = false;

            transitionId++;

            currentVideo.pause();

            await stopCurrentAudio();

            playButton.textContent = "▶";

        } else {

            playing = true;

            currentVideo
                .play()
                .catch(() => {});

const scene =
    getCurrentSceneData();

if (scene && scene.audio) {

    startSceneAudio(
        scene.audio,
        transitionId
    );

}

            playButton.textContent = "Ⅱ";

        }

    }
);


// =====================================================
// INITIAL STATE
// =====================================================
const savedScene =
    localStorage.getItem("scene");

if (
    savedScene &&
    sceneVariants[savedScene]
) {
    currentScene = savedScene;
}

Object.keys(sceneVariants).forEach(
    sceneName => {

        const savedVariant =
            localStorage.getItem(
                `${sceneName}Variant`
            );

        if (
            savedVariant &&
            sceneVariants[sceneName][savedVariant]
        ) {

            currentVariants[sceneName] =
                savedVariant;

        }

    }
);


updateVariantRail();
const initialScene =
    getCurrentSceneData();

currentVideo.src =
    getVideoUrl(initialScene.video);

currentVideo.load();

currentVideo.addEventListener(
    "loadedmetadata",
    () => {

        currentVideo.currentTime = 0.35;

    },
    { once: true }
);


// ВАЖНО:
// сайт стартует полностью остановленным.

playing = false;

playButton.textContent = "▶";

sceneTitle.textContent =
    initialScene.title;

sceneDescription.textContent =
    initialScene.description;

sceneButtons.forEach(button => {

    button.classList.toggle(
        "active",
        button.dataset.scene === currentScene
    );

});
// =====================================================
// SOFT MOUSE GLOW
// =====================================================

const mouseGlow =
    document.querySelector(".mouse-glow");

let mouseX = 0;
let mouseY = 0;

let glowX = 0;
let glowY = 0;


document.addEventListener(
    "mousemove",
    (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        mouseGlow.style.opacity = "1";

    }
);


function animateMouseGlow() {

    glowX +=
        (mouseX - glowX) * 0.08;

    glowY +=
        (mouseY - glowY) * 0.08;

    mouseGlow.style.transform =
        `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

    requestAnimationFrame(
        animateMouseGlow
    );

}


animateMouseGlow();

// =====================================================
// LOADING SCREEN
// =====================================================

const loadingScreen =
    document.querySelector("#loadingScreen");

const loadingProgress =
    document.querySelector("#loadingProgress");

const loadingVideo =
    document.querySelector("#videoA");


let loadingFinished = false;


function finishLoading() {

    if (loadingFinished) {
        return;
    }

    loadingFinished = true;

    loadingProgress.style.width = "100%";

    setTimeout(() => {

        loadingScreen.classList.add("hidden");

    }, 550);

}


/*
 * Ждём, пока первое видео сможет
 * нормально начать воспроизведение.
 */

function checkInitialVideo() {

    if (
        loadingVideo.readyState >= 3
    ) {

        finishLoading();

    }

}


/*
 * Основной вариант
 */

loadingVideo.addEventListener(
    "canplay",
    finishLoading,
    { once: true }
);


/*
 * Если браузер уже успел загрузить видео
 */

checkInitialVideo();


/*
 * Запасной вариант.
 * Сайт никогда не должен зависнуть
 * на загрузочном экране навсегда.
 */

setTimeout(() => {

    finishLoading();

}, 8000);
// =====================================================
// INITIAL LOAD FADE
// =====================================================

window.addEventListener("load", () => {

    requestAnimationFrame(() => {

        document.body.classList.remove(
            "is-loading"
        );

    });

});
