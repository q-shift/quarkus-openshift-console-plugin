import {
  CardTitle,
  CardBody,
  Card,
  ToggleGroupItem,
  ToggleGroup,
  Toolbar,
  ToolbarContent,
  ToolbarToggleGroup,
  ToolbarGroup,
  ToolbarItem,
  Select,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
} from '@patternfly/react-core';
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { TimesIcon } from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { Table, Tbody, Td, Thead, Tr, Th } from '@patternfly/react-table';
import * as React from 'react';
import { useEffect, useState } from 'react';


import { Application } from '../types';

const ApplicationLoggingCard: React.FC<{application: Application }> = ({ application }) => {

  interface Logger {
    name: string;
    level: string;
  }
  const logLevels = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
  const [selected, setSelected] = useState('INFO');
  const [loggers, _] = useState<Logger[]>([{name: 'root', level: 'INFO'}]);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
//  const [currentCategory, setCurrentCategory] = useState('Name');

  //
  // Filtering
  //
  const [inputValue, setInputValue] = useState('');
  const showClearButton = !!inputValue;
  const showUtilities = showClearButton;
  const clearInput = () => {
    setInputValue('');
  };

  const handleInputChange = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    //get text from event and set it to inputValue
    if (event && event.currentTarget && event.currentTarget.value) {
      setInputValue(event.currentTarget.value);
    } else {
      setInputValue(value);
    }
  };
  //


  useEffect(() => {
  }, [application]);

  const onDelete = () => {

  }

  const onCategoryToggle = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  }

  const onCategorySelect = () => {
    
  }

  const buildCategoryDropdown = () => {
    const categoryMenuItems = [
      <SelectOption key="name" value="Name">Name</SelectOption>,
      <SelectOption key="level" value="Level">Level</SelectOption>
    ];

    return (
      <ToolbarItem>
        <Select
          onSelect={onCategorySelect}
          onToggle={onCategoryToggle}
          isOpen={isCategoryDropdownOpen}>
          {categoryMenuItems}
        </Select>
      </ToolbarItem>
    );
  }

  const buildFilterDropdown = () => {
  return (
    <TextInputGroup>
      <TextInputGroupMain icon={<SearchIcon />} value={inputValue} onChange={handleInputChange} />
      {showUtilities && (
        <TextInputGroupUtilities>
          {showClearButton && (
            <Button variant="plain" onClick={clearInput} aria-label="Clear button and input">
              <TimesIcon />
            </Button>
          )}
        </TextInputGroupUtilities>
      )}
    </TextInputGroup>
  );
  }

  return (
    <Card>
      <CardTitle>Logging</CardTitle>
      <CardBody>
        <Toolbar id="toolbar-with-chip-groups" clearAllFilters={onDelete} collapseListedFiltersBreakpoint="xl">
          <ToolbarContent>
            <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
              <ToolbarGroup
                variant="filter-group"
                style={{ lineHeight: '22px', alignItems: 'center' } as React.CSSProperties}>
                {buildCategoryDropdown()}
                {buildFilterDropdown()}
              </ToolbarGroup>
            </ToolbarToggleGroup>
          </ToolbarContent>
        </Toolbar>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Level</Th>
            </Tr>
          </Thead>

          <Tbody>
            {loggers.map((logger) => (
              <Tr>
                <Td>{logger.name}</Td>
                <Td>
                  <ToggleGroup aria-label="Log levels">
                    {logLevels.map((level) => (
                      <ToggleGroupItem
                        text={level}
                        buttonId={level}
                        isSelected={selected === level}
                        onChange={() => setSelected(level)} />
                    ))}
                  </ToggleGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ApplicationLoggingCard;