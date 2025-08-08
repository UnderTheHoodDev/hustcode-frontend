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
    <div className="layout-padding xsm:text-2xl mb-14 flex flex-col justify-center text-xl leading-normal sm:mb-24 sm:text-3xl">
      <div className="xsm:mb-10 xsm:flex-row xsm:items-center xsm:gap-0 mb-4 flex flex-col items-center justify-center gap-2 font-semibold text-[#F472B6]">
        <span className="text-base-content">Solve your problems in&nbsp; </span>
        <div className="xsm:h-auto relative h-8 overflow-hidden">
          <Typewriter
            words={ListLanguages.map((language) => language.name)}
            loop={0}
            typeSpeed={150}
            deleteSpeed={150}
            delaySpeed={2000}
          />
        </div>
      </div>
      <div className="xsm:gap-6 flex flex-wrap justify-center gap-5 sm:gap-8">
        {ListLanguages.map((language) => (
          <Fragment key={language.name}> {language.icon} </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProgrammingLanguages;
