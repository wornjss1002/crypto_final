import Image from 'next/image'

export default function AboutPage() {
  const members = [
    {
      name: '이지훈',
      studentId: '92113774',
      role: '팀장',
      desc: '기획 및 암호화 구현',
      photo: '/jihoon.jpg',
      github: 'https://github.com/Hoodscp/Team_Crypto',
      web: 'https://team-crypto.vercel.app/capsules',
    },
    {
      name: '이시훈',
      studentId: '92212984',
      role: '기능 구현',
      desc: '로그인 및 토큰 기능 구현',
      photo: '/sihoon.jpg',
      github: 'https://github.com/KJB000/team_capsule',
      web: 'https://team-capsule.vercel.app',
    },
    {
      name: '김기현',
      studentId: '92113475',
      role: '프론트엔드',
      desc: 'UI/UX 담당',
      photo: '/gihyeon.jpg',
      github: 'https://github.com/Kimkihyeon02/time-capsule',
      web: 'https://time-capsule-gamma.vercel.app/capsules',
    },
    {
      name: '천재권',
      studentId: '92113889',
      role: '백엔드',
      desc: 'DB 연결 담당',
      photo: '/jaegwon.jpg',
      github: 'https://github.com/wornjss1002/crypto_final',
      web: 'https://crypto-final-capsule.vercel.app/capsules',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 sm:py-12">
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4">팀 소개</h1>
        <p className="text-base sm:text-xl text-gray-600">
          우리 팀의 멤버들을 소개합니다.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 w-full max-w-5xl px-4">
        {members.map((member) => (
          <div
            className="bg-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center p-6 sm:p-10 w-full sm:w-[28rem] mx-auto border-4 border-blue-300"
            key={member.name}
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0 sm:mr-10 overflow-hidden bg-blue-100 rounded-md">
              <Image
                src={member.photo}
                alt={member.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold">
                {member.name}
              </div>
              <div className="text-base sm:text-lg text-gray-700 mt-1">
                {member.studentId}
              </div>
              <div className="text-lg sm:text-2xl text-blue-600 font-semibold mt-1">
                {member.role}
              </div>
              <div className="text-base sm:text-lg text-gray-500 mt-2 sm:mt-3">
                {member.desc}
              </div>
              <div className="flex gap-2 justify-center sm:justify-start mt-4">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900 text-sm"
                >
                  GitHub
                </a>
                <a
                  href={member.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Web
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
