export const DEPARTMENTS = [
  {
    id: 'front-office',
    name: 'Front Office',
    subtitle: 'Vocabulary',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    topics: [
      {
        id: 'fo-1',
        title: 'Greetings and Welcoming Guests',
        completed: true,
        unlocked: true,
        vocab: [
          {
            en: 'Good morning.',
            id: 'Selamat pagi.',
            context: 'Formal greeting upon guest arrival in the morning.',
          },
          {
            en: 'Welcome to our hotel.',
            id: 'Selamat datang di hotel kami.',
            context: 'Warm opening phrase at the reception desk.',
          },
          {
            en: 'How can I help you?',
            id: 'Ada yang bisa saya bantu?',
            context: 'Polite offer of assistance after greeting.',
          },
        ],
        videoTitle: 'Welcoming International Guests at Reception',
        youtubeUrl: 'https://www.youtube.com/results?search_query=hotel+front+office+greeting+guests+english',
        roleplayPrompt:
          'A guest approaches the front desk at 9:00 AM looking tired after a long flight. Greet them politely and ask how you can assist.',
      },
      {
        id: 'fo-2',
        title: 'Handling Reservations',
        completed: true,
        unlocked: true,
        vocab: [
          {
            en: 'May I have your booking reference?',
            id: 'Bolehkah saya meminta nomor referensi pemesanan Anda?',
            context: 'Checking an existing reservation in the system.',
          },
          {
            en: 'I have your reservation under Mr./Ms. ...',
            id: 'Saya menemukan reservasi atas nama Bapak/Ibu ...',
            context: 'Confirming guest booking details.',
          },
        ],
        videoTitle: 'Handling Room Reservations Politely',
        youtubeUrl: 'https://www.youtube.com/results?search_query=hotel+reservation+english+dialogue',
        roleplayPrompt:
          'A guest wants to confirm their 2-night twin room booking for tonight. Verify their name and dates politely.',
      },
      {
        id: 'fo-3',
        title: 'Check-in Procedures',
        completed: false,
        unlocked: true,
        vocab: [
          {
            en: 'Could I see your ID or passport, please?',
            id: 'Bolehkah saya melihat KTP atau paspor Anda?',
            context: 'Standard check-in verification requirement.',
          },
          {
            en: 'Breakfast is served from 6:30 to 10:00 AM.',
            id: 'Sarapan disajikan mulai pukul 06.30 hingga 10.00 pagi.',
            context: 'Sharing key hotel facility information.',
          },
        ],
        videoTitle: 'Smooth Hotel Check-in Conversation',
        youtubeUrl: 'https://www.youtube.com/results?search_query=hotel+check+in+conversation+english',
        roleplayPrompt:
          'Guide a guest through check-in, ask for ID/passport, and mention breakfast hours.',
      },
      {
        id: 'fo-4',
        title: 'Giving Information & Directions',
        completed: false,
        unlocked: false,
        vocab: [
          {
            en: 'The lift is just around the corner on your left.',
            id: 'Lift berada tepat di balik sudut di sebelah kiri Anda.',
            context: 'Giving clear spatial directions in the lobby.',
          },
        ],
        videoTitle: 'Giving Directions in a Hotel',
        youtubeUrl: 'https://www.youtube.com/results?search_query=giving+directions+hotel+english',
        roleplayPrompt:
          'Direct a guest to the fitness center on the 3rd floor and the lobby lounge.',
      },
      {
        id: 'fo-5',
        title: 'Handling Guest Requests',
        completed: false,
        unlocked: false,
        vocab: [
          {
            en: 'I will arrange that right away for you.',
            id: 'Saya akan segera mengaturnya untuk Anda.',
            context: 'Prompt and reassuring response to special requests.',
          },
        ],
        videoTitle: 'Handling Special Guest Requests',
        youtubeUrl: 'https://www.youtube.com/results?search_query=handling+guest+requests+hotel+english',
        roleplayPrompt:
          'A guest asks for an extra pillow and late check-out until 1:00 PM.',
      },
      {
        id: 'fo-6',
        title: 'Handling Complaints',
        completed: false,
        unlocked: false,
        vocab: [
          {
            en: 'I sincerely apologize for the inconvenience.',
            id: 'Saya mohon maaf yang sebesar-besarnya atas ketidaknyamanan ini.',
            context: 'Empathetic apology during service recovery.',
          },
        ],
        videoTitle: 'Service Recovery & Handling Complaints',
        youtubeUrl: 'https://www.youtube.com/results?search_query=handling+complaints+hotel+english',
        roleplayPrompt:
          'A guest complains that the room air conditioning is not cooling properly.',
      },
      {
        id: 'fo-7',
        title: 'Managing Difficult Guests',
        completed: false,
        unlocked: false,
        vocab: [
          {
            en: 'I understand how frustrating this must be.',
            id: 'Saya mengerti betapa mengecewakannya situasi ini.',
            context: 'De-escalating tension while staying calm and professional.',
          },
        ],
        videoTitle: 'De-escalating Difficult Situations in Hospitality',
        youtubeUrl: 'https://www.youtube.com/results?search_query=dealing+with+difficult+guests+hotel+english',
        roleplayPrompt:
          'A guest is upset about a billing discrepancy. Stay calm, acknowledge their concern, and explain the next step.',
      },
    ],
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    subtitle: 'Essentials',
    image:
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
    topics: [
      {
        id: 'hk-1',
        title: 'Knocking & Entering Guest Rooms',
        completed: false,
        unlocked: true,
        vocab: [
          {
            en: 'Housekeeping! May I come in?',
            id: 'Housekeeping! Bolehkah saya masuk?',
            context: 'Standard polite announcement before entering a room.',
          },
        ],
        videoTitle: 'Housekeeping Room Service Etiquette',
        youtubeUrl: 'https://www.youtube.com/results?search_query=housekeeping+english+knocking+room',
        roleplayPrompt: 'Knock politely and announce housekeeping service before entering.',
      },
      {
        id: 'hk-2',
        title: 'Replacing Linens & Amenities',
        completed: false,
        unlocked: false,
        vocab: [
          {
            en: 'I have replenished your towels and toiletries.',
            id: 'Saya sudah mengganti handuk dan perlengkapan mandi Anda.',
            context: 'Confirming amenity restocking.',
          },
        ],
        videoTitle: 'Housekeeping Amenities & Linen Vocabulary',
        youtubeUrl: 'https://www.youtube.com/results?search_query=housekeeping+amenities+vocabulary+english',
        roleplayPrompt: 'Inform the guest that fresh towels and bath amenities have been placed.',
      },
    ],
  },
  {
    id: 'fb-service',
    name: 'F&B Service',
    subtitle: '& Culinary',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    topics: [
      {
        id: 'fb-1',
        title: 'Seating Guests & Presenting Menus',
        completed: false,
        unlocked: true,
        vocab: [
          {
            en: 'Would you prefer a table by the window?',
            id: 'Apakah Anda lebih suka meja di dekat jendela?',
            context: 'Offering seating options in a hotel restaurant.',
          },
        ],
        videoTitle: 'Restaurant Greeting & Seating in English',
        youtubeUrl: 'https://www.youtube.com/results?search_query=restaurant+seating+menu+english+hospitality',
        roleplayPrompt: 'Welcome two dinner guests, offer seating options, and present the menu.',
      },
      {
        id: 'fb-2',
        title: 'Taking Orders & Dietary Notes',
        completed: false,
        unlocked: false,
        vocab: [
          {
            en: 'Do you have any food allergies or dietary preferences?',
            id: 'Apakah Anda memiliki alergi makanan atau pantangan tertentu?',
            context: 'Ensuring guest safety before taking orders.',
          },
        ],
        videoTitle: 'Taking Food & Beverage Orders Politely',
        youtubeUrl: 'https://www.youtube.com/results?search_query=taking+orders+restaurant+english',
        roleplayPrompt: 'Ask about dietary preferences and recommend a signature dish.',
      },
    ],
  },
  {
    id: 'guest-relations',
    name: 'Guest Relations',
    subtitle: 'Concierge & Care',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    topics: [
      {
        id: 'gr-1',
        title: 'VIP Welcome & Personalized Care',
        completed: false,
        unlocked: true,
        vocab: [
          {
            en: 'It is a pleasure having you stay with us again.',
            id: 'Senang sekali Anda kembali menginap bersama kami.',
            context: 'Warm recognition for returning or VIP guests.',
          },
        ],
        videoTitle: 'Guest Relations & VIP Hospitality English',
        youtubeUrl: 'https://www.youtube.com/results?search_query=guest+relations+hotel+english',
        roleplayPrompt: 'Welcome a returning VIP guest and ask if their transfer went smoothly.',
      },
    ],
  },
];

export const AR_OBJECTS = [
  {
    id: 'armchair',
    label: 'Leather Armchair',
    idMeaning: 'Kursi Berlengan Kulit (Lounge Chair)',
    context:
      'Placed in the hotel lobby or executive lounge for guest comfort while waiting.',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'bell',
    label: 'Reception Bell',
    idMeaning: 'Bel Resepsionis',
    context:
      'Used at the front desk to politely alert reception staff when assistance is needed.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'towel',
    label: 'Folded Bath Towel',
    idMeaning: 'Handuk Mandi Lipat',
    context:
      'Prepared in guest rooms and replenished daily by the housekeeping team.',
    image:
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=700&q=80',
  },
];