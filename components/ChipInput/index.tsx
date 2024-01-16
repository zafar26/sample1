import Image from 'next/image';
import React, { useState, ChangeEvent, useEffect } from 'react';

interface ChipInputProps {}
interface GitHubUserProp {
    avatar_url:string,
    login:string,
    id:number
}

const ChipInput: React.FC<ChipInputProps> = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [items, setItems] = useState<GitHubUserProp[]>([]);
  const [chips, setChips] = useState<GitHubUserProp[]>([]);
  const [showTable, setShowTable] = useState<Boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  useEffect(()=>{
    if(items.length<1){
        fetch('https://api.github.com/users').then(r=>r.json()).then(r=>setItems(r))
    }
  },[])
  const handleItemClick = (item: GitHubUserProp) => {
    setChips([...chips, item]);
    setItems(items.filter((i) => i !== item));
    setInputValue('');
  };

  const handleChipRemove = (chip: GitHubUserProp) => {
    setChips(chips.filter((c) => c !== chip));
    setItems([...items, chip]);
  };

  return (
    <div className='overflow-auto'>
        <div className='flex flex-wrap'>
        {chips.map((chip:GitHubUserProp) => (
          <div key={chip.login} className=" bg-gray-100  shadow pr-10 m-2  rounded-full flex w-min  items-center">
            <Image   className='rounded-full pr-2'    loader={({ src }:any)=> src} unoptimized={true}
                src={chip.avatar_url ? chip.avatar_url  : ''} width={40}
                height={40} alt="Picture of the author"/>
            {chip.login} <span className='cursor-pointer pl-2 text-red-800 font-bold' onClick={() => handleChipRemove(chip)}>x</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        className='ring-0 outline-none'
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type here..."
        onFocus ={()=>setShowTable(true)}
      />
      <ul>
        {showTable&& items
          .filter((item:GitHubUserProp) => item.login.toLowerCase().includes(inputValue.toLowerCase()))
          .map((item:GitHubUserProp) => (
            <li key={item.id} onClick={() => handleItemClick(item)} className='flex m-2'>
              <Image   className='rounded-full pr-2'    loader={({ src }:any)=> src} unoptimized={true}
                src={item.avatar_url ? item.avatar_url  : ''} width={40} height={40} alt="Picture of the author"/>
              {item.login}
            </li>
          ))}
      </ul>
      
    </div>
  );
};

export default ChipInput;
