'use client';

import { Fragment } from 'react';
import { Typewriter } from 'react-simple-typewriter';

import ProgrammingLanguageIcons from '@/icons/ProgrammingLaguageIcons';

const {
  C,
  CPlusPlus,
  CSharp,
  Java,
  Go,
  JavaScript,
  TypeScript,
  Ruby,
  Rust,
  Python,
  Kotlin,
  PHP,
  Swift,
} = ProgrammingLanguageIcons;

const ListLanguages = [
  {
    name: 'C',
    icon: C,
  },
  {
    name: 'C++',
    icon: CPlusPlus,
  },
  {
    name: 'C#',
    icon: CSharp,
  },
  {
    name: 'Java',
    icon: Java,
  },
  {
    name: 'Go',
    icon: Go,
  },
  {
    name: 'JavaScript',
    icon: JavaScript,
  },
  {
    name: 'TypeScript',
    icon: TypeScript,
  },
  {
    name: 'Ruby',
    icon: Ruby,
  },
  {
    name: 'Rust',
    icon: Rust,
  },
  {
    name: 'Python',
    icon: Python,
  },
  {
    name: 'Kotlin',
    icon: Kotlin,
  },
  {
    name: 'PHP',
    icon: PHP,
  },
  {
    name: 'Swift',
    icon: Swift,
  },
];
function ProgrammingLanguages() {
  return (
    <div className="flex flex-col justify-center text-3xl mb-24 layout-padding">
      <div className="flex justify-center mb-11 font-semibold text-[#F472B6]">
        <span className="text-base_content">Solve your problems in&nbsp; </span>
        <Typewriter
          words={ListLanguages.map((language) => language.name)}
          loop={0}
          typeSpeed={150}
          deleteSpeed={150}
          delaySpeed={2000}
        />
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        {ListLanguages.map((language) => (
          <Fragment key={language.name}> {language.icon} </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProgrammingLanguages;
