export type SupportedLang = 'en' | 'bn' | 'hi' | 'es';

export interface TranslationDictionary {
  // Brand & Header
  brandName: string;
  brandTagline: string;
  navHome: string;
  navCreate: string;
  navDashboard: string;
  navContact: string;
  navAdmin: string;
  btnCreateQuiz: string;
  btnTakeQuiz: string;
  btnExploreQuizzes: string;
  btnTryDemo: string;
  langSelect: string;

  // Hero & Homepage
  heroTitle: string;
  heroSubtitle: string;
  quickCardTitle: string;
  quickCardSubtitle: string;
  inputYourName: string;
  inputNamePlaceholder: string;
  selectMascotTitle: string;
  boyCatTitle: string;
  boyCatSubtitle: string;
  girlCatTitle: string;
  girlCatSubtitle: string;
  btnStartCreating: string;
  genderRequiredWarning: string;
  featureTitle: string;
  featureDesc: string;
  howItWorksTitle: string;
  howItWorksStep1Title: string;
  howItWorksStep1Desc: string;
  howItWorksStep2Title: string;
  howItWorksStep2Desc: string;
  howItWorksStep3Title: string;
  howItWorksStep3Desc: string;
  featuredQuizzesTitle: string;
  featuredQuizzesSubtitle: string;

  // Quiz Creator Wizard
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  quizTitleLabel: string;
  quizTitlePlaceholder: string;
  quizDescLabel: string;
  quizDescPlaceholder: string;
  questionTextLabel: string;
  questionTextPlaceholder: string;
  answerOptionsLabel: string;
  markCorrectAnswerBadge: string;
  btnQuestionBank: string;
  btnNextQuestion: string;
  btnPrevQuestion: string;
  btnReviewAndPublish: string;
  btnPublishQuiz: string;
  btnPublishing: string;

  // Photo Attachment
  attachPhotoBtn: string;
  changePhotoBtn: string;
  removePhotoBtn: string;
  photoModalTitle: string;
  photoModalDesc: string;
  uploadFromDeviceTab: string;
  pasteUrlTab: string;
  curatedStickersTab: string;
  uploadDropText: string;
  pasteUrlPlaceholder: string;
  applyPhotoBtn: string;

  // Quiz Play Page
  quizPlayingCheer: string;
  questionOf: string;
  timeElapsed: string;
  selectOneAnswerAlert: string;
  btnNextQuestionPlay: string;
  btnSubmitQuiz: string;
  submittingAnswers: string;

  // Results & Scoreboard
  resultTitle: string;
  resultScoreText: string;
  accuracyLabel: string;
  timeSpentLabel: string;
  btnViewScoreboard: string;
  btnShareScore: string;
  btnCreateOwnQuiz: string;
  podiumTitle: string;
  podiumSubtitle: string;
  rankLabel: string;
  friendLabel: string;
  searchFriendsPlaceholder: string;
  allParticipantsLabel: string;

  // Common & Errors
  loadingText: string;
  errorOccurred: string;
  closeBtn: string;
  cancelBtn: string;
  saveBtn: string;
}

export const translations: Record<SupportedLang, TranslationDictionary> = {
  en: {
    brandName: 'BFFMeter',
    brandTagline: 'Cute Cartoon Friendship Quiz',
    navHome: 'Home',
    navCreate: 'Create Quiz',
    navDashboard: 'My Quizzes',
    navContact: 'Contact',
    navAdmin: 'Moderation',
    btnCreateQuiz: '+ Create Quiz',
    btnTakeQuiz: 'Take Quiz',
    btnExploreQuizzes: 'Explore Quizzes',
    btnTryDemo: "Try Maya's Quiz 🐱",
    langSelect: 'Language',

    heroTitle: 'How Well Do Your Best Friends Really Know You?',
    heroSubtitle: 'Create your cute cartoon friendship quiz in 60 seconds, share your secret link with friends, and discover who claims #1 spot on the podium!',
    quickCardTitle: 'Create Your Quiz In 3 Fast Steps',
    quickCardSubtitle: 'Enter your name and select your cat mascot to start:',
    inputYourName: 'Your Name or Nickname',
    inputNamePlaceholder: 'e.g. Alex, Sam, Priyo...',
    selectMascotTitle: 'Choose Your Cat Companion (Required)',
    boyCatTitle: 'Milo (Boy Cat)',
    boyCatSubtitle: 'Playful blue cap & energetic vibes',
    girlCatTitle: 'Luna (Girl Cat)',
    girlCatSubtitle: 'Sweet flower bow & cheerful spirit',
    btnStartCreating: 'Start Building Quiz 🚀',
    genderRequiredWarning: 'Please choose either Milo or Luna cat mascot before continuing!',
    featureTitle: '100% Secret & Secure Fair Play',
    featureDesc: 'Correct answers are protected on the server. Your friends cannot cheat or peek at the answers in devtools!',
    howItWorksTitle: 'How BFFMeter Works',
    howItWorksStep1Title: '1. Create Your Questions',
    howItWorksStep1Desc: 'Pick questions about your morning routines, comfort foods, and secret dreams. Attach custom photos to options!',
    howItWorksStep2Title: '2. Share Your Link',
    howItWorksStep2Desc: 'Send your generated unguessable quiz link on WhatsApp, Instagram, Messenger, or Discord.',
    howItWorksStep3Title: '3. Watch Friend Rankings',
    howItWorksStep3Desc: 'Friends answer with their own cat avatar and accurate scores appear live on the podium leaderboard.',
    featuredQuizzesTitle: 'Popular Friend Quizzes',
    featuredQuizzesSubtitle: 'Take a sample challenge or inspect how the cute test works!',

    step1Title: 'Step 1: Your Profile & Mascot',
    step1Desc: 'Set your nickname and cat companion',
    step2Title: 'Step 2: Questions, Options & Photos',
    step2Desc: 'Configure questions, options, photos, and mark your true answers',
    step3Title: 'Step 3: Preview Quiz',
    step3Desc: 'Double check how friends will see your questions',
    step4Title: 'Step 4: Share & Celebrate',
    step4Desc: 'Your quiz is ready to be shared with friends',
    quizTitleLabel: 'Quiz Title',
    quizTitlePlaceholder: 'e.g. How Well Do You Know Maya?',
    quizDescLabel: 'Challenge Note (Optional)',
    quizDescPlaceholder: 'Think you know my favorite snacks and secrets? Prove it! 💖',
    questionTextLabel: 'Question Text',
    questionTextPlaceholder: 'e.g. What is my comfort midnight snack?',
    answerOptionsLabel: 'Answer Options (Click circle to set YOUR true answer)',
    markCorrectAnswerBadge: 'Target: Mark Your Correct Answer',
    btnQuestionBank: 'Question Bank Ideas',
    btnNextQuestion: 'Next Question',
    btnPrevQuestion: 'Previous Question',
    btnReviewAndPublish: 'Review & Publish →',
    btnPublishQuiz: 'Publish My Quiz Now 🚀',
    btnPublishing: 'Publishing Quiz...',

    attachPhotoBtn: '📷 Attach Photo',
    changePhotoBtn: 'Change Photo',
    removePhotoBtn: 'Remove Photo',
    photoModalTitle: 'Attach Photo to Option',
    photoModalDesc: 'Upload a picture, paste an image URL, or pick a cute sticker illustration!',
    uploadFromDeviceTab: 'Upload File',
    pasteUrlTab: 'Image URL',
    curatedStickersTab: 'Cute Stickers',
    uploadDropText: 'Click or drop a picture here (JPG, PNG, WebP)',
    pasteUrlPlaceholder: 'https://images.unsplash.com/...',
    applyPhotoBtn: 'Apply Photo',

    quizPlayingCheer: 'Mascot Companion cheering you on!',
    questionOf: 'Question',
    timeElapsed: 'Time',
    selectOneAnswerAlert: 'Please select an answer before continuing.',
    btnNextQuestionPlay: 'Next Question →',
    btnSubmitQuiz: 'Submit My Answers 🎉',
    submittingAnswers: 'Calculating score on server...',

    resultTitle: 'Quiz Finished!',
    resultScoreText: 'Your Friendship Score',
    accuracyLabel: 'Accuracy',
    timeSpentLabel: 'Time Elapsed',
    btnViewScoreboard: 'View Full Scoreboard 🏆',
    btnShareScore: 'Share Your Score 📲',
    btnCreateOwnQuiz: 'Make Your Own Quiz 🐱',
    podiumTitle: 'Podium of Honor',
    podiumSubtitle: 'The closest friends leading the pack!',
    rankLabel: 'Rank',
    friendLabel: 'Friend',
    searchFriendsPlaceholder: 'Search friend name...',
    allParticipantsLabel: 'All Participants',

    loadingText: 'Loading...',
    errorOccurred: 'An error occurred',
    closeBtn: 'Close',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Changes',
  },

  bn: {
    brandName: 'BFFMeter',
    brandTagline: 'মিষ্টি কার্টুন ফ্রেন্ডশিপ কুইজ',
    navHome: 'হোম',
    navCreate: 'কুইজ তৈরি',
    navDashboard: 'আমার কুইজ',
    navContact: 'যোগাযোগ',
    navAdmin: 'মডারেশন',
    btnCreateQuiz: '+ কুইজ বানাও',
    btnTakeQuiz: 'কুইজ খেলো',
    btnExploreQuizzes: 'কুইজ দেখুন',
    btnTryDemo: "মায়ার কুইজ খেলুন 🐱",
    langSelect: 'ভাষা',

    heroTitle: 'তোমার সেরা বন্ধুরা তোমাকে কতটা চেনে?',
    heroSubtitle: 'মাত্র ৬০ সেকেন্ডে তোমার মিষ্টি কার্টুন ফ্রেন্ডশিপ কুইজ তৈরি করো, বন্ধুদের লিংক পাঠাও এবং পডিয়ামে কে চ্যাম্পিয়ন হয় তা দেখো!',
    quickCardTitle: '৩টি সহজ ধাপে কুইজ তৈরি করো',
    quickCardSubtitle: 'শুরু করতে নিজের নাম লেখো এবং বিড়াল ম্যাসকট বেছে নাও:',
    inputYourName: 'তোমার নাম বা ডাকনাম',
    inputNamePlaceholder: 'যেমন: রাহুল, সায়ন্তনী, প্রিয়...',
    selectMascotTitle: 'তোমার বিড়াল ম্যাসকট নির্বাচন করো (বাধ্যতামূলক)',
    boyCatTitle: 'মিলো (ছেলে বিড়াল)',
    boyCatSubtitle: 'নীল টুপি পরা চটপটে দুষ্টু বিড়াল',
    girlCatTitle: 'লুনা (মেয়ে বিড়াল)',
    girlCatSubtitle: 'গোলাপি ফুলের বো পরা মিষ্টি বিড়াল',
    btnStartCreating: 'কুইজ তৈরি শুরু করো 🚀',
    genderRequiredWarning: 'এগিয়ে যেতে অনুগ্রহ করে মিলো বা লুনা বিড়াল ম্যাসকট নির্বাচন করুন!',
    featureTitle: '১০০% নিরাপদ ও গোপনীয় উত্তর',
    featureDesc: 'সঠিক উত্তর সার্ভারে সংরক্ষিত থাকে। বন্ধুরা কোনোভাবেই চিটিং বা উত্তর দেখতে পারবে না!',
    howItWorksTitle: 'যেভাবে কাজ করে BFFMeter',
    howItWorksStep1Title: '১. প্রশ্ন ও উত্তর ঠিক করো',
    howItWorksStep1Desc: 'সকালের অভ্যাস, প্রিয় খাবার বা গোপন স্বপ্নের প্রশ্ন বেছে নাও। অপশনে নিজের ফটো বা স্টিকার যোগ করো!',
    howItWorksStep2Title: '২. লিংক বন্ধুদের পাঠাও',
    howItWorksStep2Desc: 'হোয়াটসঅ্যাপ, মেসেঞ্জার বা ইনস্টাগ্রামে তোমার তৈরি সিক্রেট কুইজ লিংক শেয়ার করো।',
    howItWorksStep3Title: '৩. লাইভ স্কোরবোর্ড দেখো',
    howItWorksStep3Desc: 'বন্ধুরা উত্তর দিলে লাইভ পডিয়ামে র‍্যাঙ্কিং দেখতে পারবে কে তোমার সবচেয়ে ভালো বন্ধু!',
    featuredQuizzesTitle: 'জনপ্রিয় ফ্রেন্ডশিপ কুইজ',
    featuredQuizzesSubtitle: 'ডেমো খেলে দেখে নাও বন্ধুদের কুইজ কেমন হয়!',

    step1Title: 'ধাপ ১: তোমার প্রোফাইল ও ম্যাসকট',
    step1Desc: 'নাম ও বিড়াল ম্যাসকট নির্বাচন করো',
    step2Title: 'ধাপ ২: প্রশ্ন, অপশন ও ফটো',
    step2Desc: 'প্রশ্ন ও অপশন সাজাও, ফটো লাগাও এবং সঠিক উত্তর চিহ্নিত করো',
    step3Title: 'ধাপ ৩: প্রিভিউ',
    step3Desc: 'বন্ধুরা কীভাবে দেখবে তা প্রিভিউ করো',
    step4Title: 'ধাপ ৪: শেয়ার ও আনন্দ',
    step4Desc: 'তোমার কুইজ লিংক তৈরি ও শেয়ারের জন্য প্রস্তুত',
    quizTitleLabel: 'কুইজের নাম',
    quizTitlePlaceholder: 'যেমন: মায়াকে তুমি কতটা চেনো?',
    quizDescLabel: 'চ্যালেঞ্জ নোট (ঐচ্ছিক)',
    quizDescPlaceholder: 'আমার প্রিয় খাবার বা অভ্যাস কি তুমি জানো? প্রমাণ করো! 💖',
    questionTextLabel: 'প্রশ্ন',
    questionTextPlaceholder: 'যেমন: মধ্যরাতে আমার সবচেয়ে প্রিয় খাবার কোনটি?',
    answerOptionsLabel: 'উত্তরের অপশনসমূহ (বৃত্তে ক্লিক করে আসল উত্তরটি সিলেক্ট করো)',
    markCorrectAnswerBadge: 'লক্ষ্য: তোমার আসল উত্তর সিলেক্ট করো',
    btnQuestionBank: 'রেডিমেড প্রশ্ন ভাণ্ডার',
    btnNextQuestion: 'পরের প্রশ্ন',
    btnPrevQuestion: 'আগের প্রশ্ন',
    btnReviewAndPublish: 'প্রিভিউ ও প্রকাশ →',
    btnPublishQuiz: 'কুইজ পাবলিশ করো 🚀',
    btnPublishing: 'পাবলিশ হচ্ছে...',

    attachPhotoBtn: '📷 ছবি লাগাও',
    changePhotoBtn: 'ছবি পরিবর্তন',
    removePhotoBtn: 'ছবি মুছুন',
    photoModalTitle: 'অপশনে ছবি যুক্ত করুন',
    photoModalDesc: 'ডিভাইস থেকে ফটো আপলোড করো, ছবির লিংক দাও বা সুন্দর স্টিকার বাছো!',
    uploadFromDeviceTab: 'ফাইল আপলোড',
    pasteUrlTab: 'ছবির লিংক',
    curatedStickersTab: 'সুন্দর স্টিকার',
    uploadDropText: 'ছবি সিলেক্ট করতে ক্লিক করো (JPG, PNG, WebP)',
    pasteUrlPlaceholder: 'https://images.unsplash.com/...',
    applyPhotoBtn: 'ছবি নিশ্চিত করো',

    quizPlayingCheer: 'তোমার বিড়াল বন্ধু উৎসাহ দিচ্ছে!',
    questionOf: 'প্রশ্ন',
    timeElapsed: 'সময়',
    selectOneAnswerAlert: 'এগিয়ে যেতে অনুগ্রহ করে একটি উত্তর বেছে নিন।',
    btnNextQuestionPlay: 'পরের প্রশ্ন →',
    btnSubmitQuiz: 'উত্তর জমা দিন 🎉',
    submittingAnswers: 'সার্ভারে স্কোর হিসেব হচ্ছে...',

    resultTitle: 'কুইজ সম্পন্ন হয়েছে!',
    resultScoreText: 'তোমার ফ্রেন্ডশিপ স্কোর',
    accuracyLabel: 'সঠিকতা',
    timeSpentLabel: 'সময় লেগেছে',
    btnViewScoreboard: 'পুরো স্কোরবোর্ড দেখুন 🏆',
    btnShareScore: 'স্কোর শেয়ার করো 📲',
    btnCreateOwnQuiz: 'নিজের কুইজ তৈরি করো 🐱',
    podiumTitle: 'সম্মানের পডিয়াম',
    podiumSubtitle: 'সবচেয়ে সেরা বন্ধুরা যারা সবার আগে!',
    rankLabel: 'র‍্যাঙ্ক',
    friendLabel: 'বন্ধু',
    searchFriendsPlaceholder: 'বন্ধুর নাম খুঁজুন...',
    allParticipantsLabel: 'সকল অংশগ্রহণকারী',

    loadingText: 'লোড হচ্ছে...',
    errorOccurred: 'সমস্যা হয়েছে',
    closeBtn: 'বন্ধ করুন',
    cancelBtn: 'বাতিল',
    saveBtn: 'পরিবর্তন সংরক্ষণ করুন',
  },

  hi: {
    brandName: 'BFFMeter',
    brandTagline: 'प्यारी कार्टून फ्रेंडशिप क्विज़',
    navHome: 'होम',
    navCreate: 'क्विज़ बनाएं',
    navDashboard: 'मेरी क्विज़',
    navContact: 'संपर्क',
    navAdmin: 'मॉडरेशन',
    btnCreateQuiz: '+ क्विज़ बनाएं',
    btnTakeQuiz: 'क्विज़ खेलें',
    btnExploreQuizzes: 'क्विज़ देखें',
    btnTryDemo: 'माया की क्विज़ खेलें 🐱',
    langSelect: 'भाषा',

    heroTitle: 'आपके सबसे अच्छे दोस्त आपको वास्तव में कितना जानते हैं?',
    heroSubtitle: '60 सेकंड में अपनी प्यारी कार्टून फ्रेंडशिप क्विज़ बनाएं, दोस्तों को लिंक भेजें और देखें कि पोडियम पर नंबर 1 कौन बनता है!',
    quickCardTitle: '3 आसान चरणों में क्विज़ बनाएं',
    quickCardSubtitle: 'शुरू करने के लिए अपना नाम लिखें और बिल्ली मैस्कॉट चुनें:',
    inputYourName: 'आपका नाम या उपनाम',
    inputNamePlaceholder: 'जैसे: राहुल, आरव, प्रिया...',
    selectMascotTitle: 'अपनी बिल्ली मैस्कॉट चुनें (अनिवार्य)',
    boyCatTitle: 'माइलो (लड़का बिल्ली)',
    boyCatSubtitle: 'नीली टोपी वाली चंचल ऊर्जावान बिल्ली',
    girlCatTitle: 'लूना (लड़की बिल्ली)',
    girlCatSubtitle: 'गुलाबी फूल बो वाली प्यारी बिल्ली',
    btnStartCreating: 'क्विज़ बनाना शुरू करें 🚀',
    genderRequiredWarning: 'आगे बढ़ने से पहले कृपया माइलो या लूना बिल्ली मैस्कॉट चुनें!',
    featureTitle: '100% सुरक्षित और निष्पक्ष खेल',
    featureDesc: 'सही उत्तर सर्वर पर सुरक्षित हैं। दोस्त डेवलपर टूल्स में उत्तर नहीं देख सकते!',
    howItWorksTitle: 'BFFMeter कैसे काम करता है',
    howItWorksStep1Title: '1. अपने सवाल तय करें',
    howItWorksStep1Desc: 'सुबह की आदतों और पसंदीदा खानों के सवाल चुनें। विकल्पों में अपनी तस्वीरें जोड़ें!',
    howItWorksStep2Title: '2. लिंक शेयर करें',
    howItWorksStep2Desc: 'व्हाट्सएप या इंस्टाग्राम पर अपना सीक्रेट क्विज़ लिंक भेजें।',
    howItWorksStep3Title: '3. लाइव स्कोर देखें',
    howItWorksStep3Desc: 'दोस्तों के उत्तर देने पर लाइव पोडियम पर उनकी रैंकिंग देखें।',
    featuredQuizzesTitle: 'लोकप्रिय फ्रेंडशिप क्विज़',
    featuredQuizzesSubtitle: 'डेमो क्विज़ खेलें और देखें कि यह कैसे काम करता है!',

    step1Title: 'चरण 1: आपकी प्रोफाइल और मैस्कॉट',
    step1Desc: 'नाम और बिल्ली मैस्कॉट चुनें',
    step2Title: 'चरण 2: प्रश्न, विकल्प और तस्वीरें',
    step2Desc: 'प्रश्न सेट करें, तस्वीरें जोड़ें और सही उत्तर मार्क करें',
    step3Title: 'चरण 3: पूर्वावलोकन',
    step3Desc: 'देखें कि दोस्त आपके प्रश्नों को कैसे देखेंगे',
    step4Title: 'चरण 4: शेयर करें',
    step4Desc: 'आपकी क्विज़ शेयर करने के लिए तैयार है',
    quizTitleLabel: 'क्विज़ का शीर्षक',
    quizTitlePlaceholder: 'जैसे: आप मुझे कितना जानते हैं?',
    quizDescLabel: 'चुनौती नोट (वैकल्पिक)',
    quizDescPlaceholder: 'क्या आप मेरी पसंद-नापसंद जानते हैं? साबित करें! 💖',
    questionTextLabel: 'प्रश्न',
    questionTextPlaceholder: 'जैसे: मेरा पसंदीदा मिडनाइट स्नैक क्या है?',
    answerOptionsLabel: 'उत्तर विकल्प (अपना सही उत्तर चुनने के लिए सर्कल पर क्लिक करें)',
    markCorrectAnswerBadge: 'लक्ष्य: अपना सही उत्तर चुनें',
    btnQuestionBank: 'रेडीमेड प्रश्न बैंक',
    btnNextQuestion: 'अगला प्रश्न',
    btnPrevQuestion: 'पिछला प्रश्न',
    btnReviewAndPublish: 'समीक्षा और प्रकाशित करें →',
    btnPublishQuiz: 'क्विज़ प्रकाशित करें 🚀',
    btnPublishing: 'प्रकाशित हो रहा है...',

    attachPhotoBtn: '📷 फोटो जोड़ें',
    changePhotoBtn: 'फोटो बदलें',
    removePhotoBtn: 'फोटो हटाएं',
    photoModalTitle: 'विकल्प में फोटो जोड़ें',
    photoModalDesc: 'फोटो अपलोड करें, इमेज यूआरएल डालें या प्यारा स्टिकर चुनें!',
    uploadFromDeviceTab: 'फाइल अपलोड',
    pasteUrlTab: 'इमेज यूआरएल',
    curatedStickersTab: 'प्यारे स्टिकर',
    uploadDropText: 'फोटो चुनने के लिए यहां क्लिक करें',
    pasteUrlPlaceholder: 'https://images.unsplash.com/...',
    applyPhotoBtn: 'फोटो लागू करें',

    quizPlayingCheer: 'आपकी बिल्ली साथी उत्साह बढ़ा रही है!',
    questionOf: 'प्रश्न',
    timeElapsed: 'समय',
    selectOneAnswerAlert: 'कृपया आगे बढ़ने से पहले एक उत्तर चुनें।',
    btnNextQuestionPlay: 'अगला प्रश्न →',
    btnSubmitQuiz: 'उत्तर सबमिट करें 🎉',
    submittingAnswers: 'स्कोर की गणना हो रही है...',

    resultTitle: 'क्विज़ समाप्त!',
    resultScoreText: 'आपका फ्रेंडशिप स्कोर',
    accuracyLabel: 'सटीकता',
    timeSpentLabel: 'लगा समय',
    btnViewScoreboard: 'पूरा स्कोरबोर्ड देखें 🏆',
    btnShareScore: 'स्कोर शेयर करें 📲',
    btnCreateOwnQuiz: 'अपनी खुद की क्विज़ बनाएं 🐱',
    podiumTitle: 'सम्मान का पोडियम',
    podiumSubtitle: 'सबसे करीबी दोस्त जो सबसे आगे हैं!',
    rankLabel: 'रैंक',
    friendLabel: 'दोस्त',
    searchFriendsPlaceholder: 'दोस्त का नाम खोजें...',
    allParticipantsLabel: 'सभी प्रतिभागी',

    loadingText: 'लोड हो रहा है...',
    errorOccurred: 'एक त्रुटि हुई',
    closeBtn: 'बंद करें',
    cancelBtn: 'रद्द करें',
    saveBtn: 'परिवर्तन सहेजें',
  },

  es: {
    brandName: 'BFFMeter',
    brandTagline: 'Cuestionario de Amistad Animado',
    navHome: 'Inicio',
    navCreate: 'Crear Quiz',
    navDashboard: 'Mis Quizzes',
    navContact: 'Contacto',
    navAdmin: 'Moderación',
    btnCreateQuiz: '+ Crear Quiz',
    btnTakeQuiz: 'Jugar Quiz',
    btnExploreQuizzes: 'Explorar Quizzes',
    btnTryDemo: 'Quiz de Maya 🐱',
    langSelect: 'Idioma',

    heroTitle: '¿Qué tan bien te conocen realmente tus mejores amigos?',
    heroSubtitle: '¡Crea tu adorable cuestionario de amistad en 60 segundos, comparte tu enlace y descubre quién sube al podio!',
    quickCardTitle: 'Crea tu Quiz en 3 Pasos Rápidos',
    quickCardSubtitle: 'Ingresa tu nombre y elige a tu gato mascota para comenzar:',
    inputYourName: 'Tu Nombre o Apodo',
    inputNamePlaceholder: 'ej. Alex, Dani, Mateo...',
    selectMascotTitle: 'Elige tu Gato Acompañante (Obligatorio)',
    boyCatTitle: 'Milo (Gatito Niño)',
    boyCatSubtitle: 'Gorra azul y energía juguetona',
    girlCatTitle: 'Luna (Gatita Niña)',
    girlCatSubtitle: 'Lazo de flor rosa y espíritu alegre',
    btnStartCreating: 'Comenzar a Crear 🚀',
    genderRequiredWarning: '¡Por favor elige a Milo o Luna antes de continuar!',
    featureTitle: '100% Secreto y Juego Limpio',
    featureDesc: 'Las respuestas correctas están protegidas en el servidor. ¡Tus amigos no pueden hacer trampa!',
    howItWorksTitle: 'Cómo Funciona BFFMeter',
    howItWorksStep1Title: '1. Elige tus Preguntas',
    howItWorksStep1Desc: 'Selecciona preguntas sobre tus hábitos y snacks. ¡Adjunta fotos personalizadas a las opciones!',
    howItWorksStep2Title: '2. Comparte tu Enlace',
    howItWorksStep2Desc: 'Envía tu enlace secreto por WhatsApp, Instagram o Discord.',
    howItWorksStep3Title: '3. Mira las Puntuaciones',
    howItWorksStep3Desc: 'Tus amigos responden y aparecen en vivo en el podio de honor.',
    featuredQuizzesTitle: 'Quizzes Populares',
    featuredQuizzesSubtitle: '¡Prueba un desafío de demostración!',

    step1Title: 'Paso 1: Tu Perfil y Mascota',
    step1Desc: 'Define tu apodo y tu gato acompañante',
    step2Title: 'Paso 2: Preguntas, Opciones y Fotos',
    step2Desc: 'Configura preguntas, fotos y marca tu respuesta verdadera',
    step3Title: 'Paso 3: Vista Previa',
    step3Desc: 'Verifica cómo verán tus amigos el quiz',
    step4Title: 'Paso 4: Compartir y Celebrar',
    step4Desc: 'Tu quiz está listo para compartir',
    quizTitleLabel: 'Título del Quiz',
    quizTitlePlaceholder: 'ej. ¿Cuánto conoces a Maya?',
    quizDescLabel: 'Nota del Reto (Opcional)',
    quizDescPlaceholder: '¿Crees que conoces mis secretos? ¡Pruébalo! 💖',
    questionTextLabel: 'Pregunta',
    questionTextPlaceholder: 'ej. ¿Cuál es mi snack nocturno favorito?',
    answerOptionsLabel: 'Opciones de Respuesta (Haz clic en el círculo para tu respuesta real)',
    markCorrectAnswerBadge: 'Objetivo: Marca tu Respuesta Correcta',
    btnQuestionBank: 'Banco de Preguntas',
    btnNextQuestion: 'Siguiente Pregunta',
    btnPrevQuestion: 'Pregunta Anterior',
    btnReviewAndPublish: 'Revisar y Publicar →',
    btnPublishQuiz: 'Publicar mi Quiz Ahora 🚀',
    btnPublishing: 'Publicando Quiz...',

    attachPhotoBtn: '📷 Adjuntar Foto',
    changePhotoBtn: 'Cambiar Foto',
    removePhotoBtn: 'Quitar Foto',
    photoModalTitle: 'Adjuntar Foto a la Opción',
    photoModalDesc: '¡Sube una foto, pega una URL o selecciona un sticker animado!',
    uploadFromDeviceTab: 'Subir Archivo',
    pasteUrlTab: 'URL de Imagen',
    curatedStickersTab: 'Stickers Lindos',
    uploadDropText: 'Haz clic para seleccionar foto (JPG, PNG, WebP)',
    pasteUrlPlaceholder: 'https://images.unsplash.com/...',
    applyPhotoBtn: 'Aplicar Foto',

    quizPlayingCheer: '¡Tu gato acompañante te anima!',
    questionOf: 'Pregunta',
    timeElapsed: 'Tiempo',
    selectOneAnswerAlert: 'Por favor selecciona una respuesta antes de continuar.',
    btnNextQuestionPlay: 'Siguiente Pregunta →',
    btnSubmitQuiz: 'Enviar Respuestas 🎉',
    submittingAnswers: 'Calculando puntuación en el servidor...',

    resultTitle: '¡Quiz Completado!',
    resultScoreText: 'Tu Puntuación de Amistad',
    accuracyLabel: 'Precisión',
    timeSpentLabel: 'Tiempo Transcurrido',
    btnViewScoreboard: 'Ver Tabla de Posiciones 🏆',
    btnShareScore: 'Compartir Puntuación 📲',
    btnCreateOwnQuiz: 'Crear Mi Propio Quiz 🐱',
    podiumTitle: 'Podio de Honor',
    podiumSubtitle: '¡Los mejores amigos liderando la tabla!',
    rankLabel: 'Puesto',
    friendLabel: 'Amigo',
    searchFriendsPlaceholder: 'Buscar nombre de amigo...',
    allParticipantsLabel: 'Todos los Participantes',

    loadingText: 'Cargando...',
    errorOccurred: 'Ocurrió un error',
    closeBtn: 'Cerrar',
    cancelBtn: 'Cancelar',
    saveBtn: 'Guardar Cambios',
  },
};
