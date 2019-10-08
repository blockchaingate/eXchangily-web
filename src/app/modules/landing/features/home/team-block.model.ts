export class TeamBlock {
  name: string;
  title: string;
  image: string;
  skills?: Array<string>;
  special?: boolean;
  linkedIn?: string;
}

export class TeamSection {
  type: string;
  spacing: number;
  members: Array<TeamBlock>;
  open?: boolean;

}


export const Team: Array<TeamSection> = [
  {
    type: 'The Advisory Board',
    spacing: 30,
    open: false,
    members: [
      {
        name: 'Brad Nickel',
        title: 'Business and Marketing Consultant',
        image: 'images/photos/Brad_Nickel_m.jpg',
        skills: [
          'Technology and Business Consultant',
          'Startups and innovation specialist',
          'Crypto-currency and Blockchain expert',
          'Adjunct professor - Florida International Unversity',
        ],
        linkedIn: 'https://www.linkedin.com/in/bradnickel'
      },
      {
        name: 'Sead Muftic',
        title: 'CEO at Blockchain Information Exchange Security Corp.',
        image: 'images/photos/Sead_Muftic_m.jpg',
        skills: [
          'Blockchain security expert',
          'Professor - The Royal Institute of Technology',
          'CEO of Setecs Inc.',
          'Guest Professor - The George Washington Unversity',
        ],
        linkedIn: 'https://www.linkedin.com/in/sead-muftic-7b35aa6'
      },
      {
        name: 'Liza Horowitz',
        title: 'CIO',
        image: 'images/photos/Liza_Horowitz_m.jpg',
        skills: [
          'Board Member and Canadian Director, Global Women in Blockchain',
          'Master of Science, Environment and Communications',
          'Senior marketing and communication lead at Canadian Western Bank, Scotiabank and professional consultants'
        ],
        linkedIn: 'https://www.linkedin.com/in/lizahorowitz/'
      },
      {
        name: 'David Murry',
        title: 'Blockchain Specialist',
        image: 'images/photos/David_Murry_m.jpg',
        skills: [
          'Founder CEO at Kainui Canoe',
          'Blockchain Specialist Blockchain Competence Center',
          'Book Author of Blockchain Disruption - Creating a Decentralized and Distrubted World',
          'BlockchainNews.com creator',
        ],
        linkedIn: 'https://www.linkedin.com/in/david-murry-79512213'
      },
      {
        name: 'Dr. Steven F. Browdy',
        title: 'Science and Technology Consultant',
        image: 'images/photos/Steven_Browdy_m.jpg',
        skills: [
          'Ph.D. in Mathematics, education and software expert',
          'Member of the Global Earth Observation System of Systems(GEOSS)',
          'Involved in National Science Foundation-sponsored EarthCube',
          'Chair of the Standards and Interoperability Forum',
          'Research Group Research Data Alliance (RDA) and IEEE',
          'Standards Association P1931.1 Network, Security and Blockchain Editor',
        ],
        linkedIn: 'https://www.linkedin.com/in/steven-browdy-6169584'
      }
    ]
  },
  {
    type: 'Management Team',
    spacing: 30,
    open: false,
    members: [
      {
        name: 'Paul Liu',
        title: 'Founder, President',
        image: 'images/photos/Paul_Liu_m.jpg',
        skills: [
          'Cheif blockchain specialist',
          'Former China UnionPay Financial Network G Manager',
          'BaoSell Supply-chain and e-commerce CEO',
          'Caterpillar MIS and Supply-chain Advanced Technology Consultant',
          'Owner of a series of inventions on blockchain'
        ],
        linkedIn: 'https://www.linkedin.com/in/paul-liu-77666361/'
      },
      {
        name: 'Mohamed El Kandri',
        title: 'CEO',
        image: 'images/photos/Mohamed_Kandri_m.jpg',
        skills: [
          'MBA, Master in Technology Entrepreneurship and Innovation',
          'Blockchain expoert and keynote speaker',
          'Durland Innovation Award Recepient (Blockchain)',
          'Beta Gamma Sigma Award Holder',
          'Strategic Initiatives Lead at The Blockchainhub - York University',
          'C-Lab Incubation Program (Blockchain) Lead at The Blockchainhub - York University',
          'Member of the Global Blockchain Consortium',
          'Blockchain researcher',
        ],
        linkedIn: 'https://www.linkedin.com/in/mohamedelkandri'
      },
      {
        name: 'Liza Horowitz',
        title: 'CMO',
        image: 'images/photos/Liza_Horowitz_m.jpg',
        skills: [
          'Master of Science, Environment and Communications',
          'Blockchain speaker and educator',
          'Advisor SPL Group – ATM and emerging technology',
          'Senior marketing and communication lead at Canadian Western Bank, Scotiabank and professional consultants',
          'Board Member and Canadian Director, Global Women in Blockchain',
        ],
        linkedIn: 'https://www.linkedin.com/in/lizahorowitz/'
      },
      // {
      //  name: 'Dora Tang',
      //  title: 'CEO, FAB U.S',
      //  image: 'images/photos/Dora_Tang_m.jpg',
      //  skills: [
      //    'Cheif blockchain specialist',
      //    'Former China UnionPay Financial Network G. Manager',
      //    'BaoSell Supply-chain and e-commerce CEO',
      //    'Caterpillar MIS and Supply-chain Advanced Technology Consultant',
      //    'Owner of a series of inventions on blockchain'
      //  ],
      //  linkedIn: 'https://www.linkedin.com/in/dora-tang-b0342bb'
      // },
        {
         name: 'Jason Hong',
         title: 'CTO',
         image: 'images/photos/Jason_Hong_m.jpg',
         skills: [
          'Gotrust Tech Inc. Senior Software Engineer / Architect',
          'WinMagic Senior Software Engineer',
          'Baoheng Security Software Specialist',
          'WatchData System Co.，Ltd Software Expert',
         ],
         linkedIn: 'https://www.linkedin.com/in/zhanxin'
       },
      {
        name: 'Fred Li',
        title: 'Managing Director',
        image: 'images/photos/Fred_Li_m.jpg',
        skills: [
          'MBA Arizona State University',
          'Bipivot Program/Project/Product Management',
          'MCIS IT Professional - Project Management',
          'SBTI Sr. Consultant - Process and Service Management',
          'Motorola Director - Global IT Service Delivery'
        ],
        linkedIn: 'someur://www.linkedin.com/in/fred-l-059b336'
      }
    ]
  },
  {
    type: 'Engineering',
    spacing: 25,
    open: false,
    members: [
      {
        name: 'Sam Gong',
        title:  'Team Lead, Engineering',
        image: 'images/photos/Sam_Gong_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/sam-gong/ '
      },
      {
        name: 'Todor Milev',
        title: 'Senior C++ Programmer',
        image: 'images/photos/Todor_Milev_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/todor-milev-2985326b/'
      },
      {
        name: 'Ankit Shah',
        title: 'Senior Software Developer',
        image: 'images/photos/Ankit_Shah_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/ankitshahnet/'
      },
      {
        name: 'Nader Shiri',
        title: 'Senior Developer',
        image: 'images/photos/Nader_Shiri_m.jpg',
      },
      {
        name: 'Wesam Helou',
        title: '...',
        image: 'images/photos/Wesam_Helou_m.png'
      },
      {
        name: 'Kaiqing Fan',
        title: '..',
        image: 'images/photos/Kaiqing_Fan_m.png'
      },
      {
        name: 'Jonathan Yan',
        title: 'Senior Developer',
        image: 'images/photos/Jonathan_Yan_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/jonathan-yan-6479ab22/'
      },
      {
        name: 'Nadia S.C.',
        special: true,
        title: 'Full-Stack Developer',
        image: 'images/photos/Nadia_SC_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/nadia-s-c-010b3597'
      },
      {
        name: 'Jack Li',
        title: 'Full-Stack Developer',
        image: 'images/photos/Yanpei_Li_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/yanpei-li-a4938391/'
      },
      {
        name: 'Xiao(Bill) Li',
        title: 'Junior Software Developer',
        image: 'images/photos/Xiao_Li_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/xiao-li-442a8bb0/'
      },
      {
        name: 'Jerome Alve',
        title: 'Junior Developer',
        image: 'images/photos/Jerome_Alve_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/jerome-alve-487721120/'
      },
      {
        name: 'Alex Vuong',
        title: 'Junior Developer',
        image: 'images/photos/Alex_Vuong_m.jpg',
      },
      {
        name: 'Adil Asim',
        title: 'Junior Developer',
        image: 'images/photos/Adil_Asim_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/adil-asim-04324a109/'
      }
    ]
  },
  {
    type: 'Marketing',
    spacing: 25,
    open: false,
    members: [
      {
        name: 'Eugene Cofie',
        title: 'Product Manager',
        image: 'images/photos/Eugene_Cofie_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/eugene-cofie-49957a65/'
      },
      {
        name: 'Sarah Wu',
        title: 'Head of Business Strategy',
        image: 'images/photos/Sarah_Wu_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/sarah-wu-593a80a1'
      },
      {
        name: 'Gloria Gomez',
        title: 'Multimedia Specialist',
        image: 'images/photos/Gloria_Gomez_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/gloria-gomez-b3ab5b77/'
      },
      {
        name: 'Lorrie Liu',
        title: 'Lead Designer',
        image: 'images/photos/Lorrie_Liu_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/ooomos/'
      },
      {
        name: 'HuiQiang Yue',
        title: 'Chinese Community Assistant',
        image: 'images/photos/HuiQiang_Yue_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/%E6%85%A7%E5%BC%BA-%E5%B2%B3-6352b1106/'
      },
      {
        name: 'Mayank Roy',
        title: 'English Community Assistant',
        image: 'images/photos/Mayank_Roy_m.jpg',
        linkedIn: 'https://www.linkedin.com/in/mayank-roy-91418332/'
      },
      // {
      //   name: 'Emily Ka Yi',
      //   title: 'Marketing Specialist',
      //   linkedIn: 'someurl'
      // }
    ]
  }
];
