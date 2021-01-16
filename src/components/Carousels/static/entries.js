import Category from "../../../../redux/reducers/Category";


export const Entries = (props) => {
  const ENTRIES1 = [
    { 
      number: 1,
      question: "How hard are you trying to party?",
      label: "Fun",
      data:[{  
          title: 'Hard',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/e_auto_saturation,q_100,r_0/v1610676376/BarPeak/party-hard_cujid5.jpg',
      },
      {   
          title: 'Moderate',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610676376/BarPeak/party-moderate_ix73ef.jpg'
      },
      {   title: 'Mellow',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/bo_1px_solid_rgb:000,e_auto_color,fl_preserve_transparency,o_100,q_100,z_0.4/v1610676376/BarPeak/party-mellow_qevgee.jpg'
      }]
    },
    { 
      number: 2,
      question: "What type of partying are you looking for?",
      label: "Party",
      data:[
        {  
          title: 'Bar',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_99/v1608140714/bqf3bkea7qnfc3ulijmm.jpg',
        },
        {   
            title: 'Night Clubs',
            illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610677283/BarPeak/nightClubs_ecpho5.jpg'
        }
      ]
    },
    { 
      number: 3,
      question: "What types of Bar Are you Looking For?",
      label: "Bar",
      data:[
        {  
          title: 'Dive Bar',
          illustration: 'https://i.imgur.com/UYiroysl.jpg',
        },
        {   
            title: 'Rooftop Bar',
            illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
        }
      ]
    },
    { 
      number: 4,
      question: "What level of crowd are you looking for?",
      label: "Crowd",
      data:[
        {  
          title: 'Crowded',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610676376/BarPeak/crowd-crowded_zfhmdu.jpg',
        },
        {   
            title: 'Moderate Crowd',
            illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610676375/BarPeak/crowd-moderate_k1shmz.jpg'
        },
        {   
          title: 'Uncrowded',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610676376/BarPeak/crowd-uncrowded_kchopa.jpg'
        }
      ]
    },
    { 
      number: 5,
      question: "What age demographic?",
      label: "Age Range",
      data:[
        {  
          title: '21-25',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610676375/BarPeak/age-21-25_jxibdw.jpg',
        },
        {   
          title: '25-45',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610676375/BarPeak/age-45-plus_az1krn.jpg'
        },
        {   
          title: '45+',
          illustration: 'https://res.cloudinary.com/developer-inn/image/upload/q_100/v1610676375/BarPeak/age-25-45_tetbe4.jpg'
        }
      ]
    }
  ];
  

  const data = ENTRIES1.map((entry)=> {
    if(entry.label === "Bar"){
      return{ 
       question: entry.question, 
       label:entry.label, 
       data: props.filter((category)=>{
          if(category.type === "sub_bar")
            return true
          return false   
        }).map(category => {
            return{
              title: category.title,
              illustration: category.imageUrl,
              id: category._id
            }
        })
      }
    }
    else
      return entry 
  })

  return data;

}

