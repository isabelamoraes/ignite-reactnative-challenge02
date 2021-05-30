import React, { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import { useStorageData } from '../../hooks/storage';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getStorageData, dataStorage} = useStorageData();

  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    try {

      await getStorageData();

      setData(dataStorage);
      setSearchListData(dataStorage);

      if(isLoading)
        setIsLoading(false)


    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível carregar os dados!')
    }
  }

  useEffect(() => {
    loadData();
  }, [isLoading]);

  useFocusEffect(useCallback(() => {
    setIsLoading(true)
    loadData();
  }, []));

  function handleFilterLoginData(search: string) {
    // Filter results inside data, save with setSearchListData
    if (search.length > 0) {
      const filter = data
        .filter((login: LoginDataProps) =>
          login.title.toLowerCase().includes(search.toLowerCase())
        );

      setSearchListData(filter);
    }else{
      setSearchListData(data);
    }
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}