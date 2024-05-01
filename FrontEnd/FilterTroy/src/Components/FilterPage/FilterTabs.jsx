import * as Tabs from '@radix-ui/react-tabs';
import React from 'react'
import './Theme/FilterTabs.scss'
import Editor from './Editor';

const FilterTabs = () => {
  return (
    <Tabs.Root className='TabRoot'>
      <Tabs.List aria-label="Filters" className='TabList'>
        <Tabs.Trigger value="View" className='TabTrigger'>View</Tabs.Trigger>
        <Tabs.Trigger value="Code" className='TabTrigger'>Code</Tabs.Trigger>
        <Tabs.Trigger value="Variables" className='TabTrigger'>Variables</Tabs.Trigger>
      </Tabs.List>
      <div className='filterWindow'>
        <Tabs.Content value="View" className='TabContent'>View</Tabs.Content>
        <Tabs.Content value="Code" className='TabContent'><Editor mode={"python"} desc={"write your filter code here"} title={"Code Editor"} includeTime/></Tabs.Content>
        <Tabs.Content value="Variables" className='TabContent'><Editor mode={"json"} desc={"write your variables here"} title={"Variable Editor"}/></Tabs.Content>
      </div>
    </Tabs.Root>
  )
}

export default FilterTabs