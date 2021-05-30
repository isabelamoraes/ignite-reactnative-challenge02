import React from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

import { useStorageData } from '../../hooks/storage';

import {
  Container,
  HeaderTitle,
  Form,
  Content
} from './styles';

interface FormData {
  title: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required('Título é obrigatório!'),
  email: Yup.string().email('Não é um email válido').required('Email é obrigatório!'),
  password: Yup.string().required('Senha é obrigatória!'),
})

export function RegisterLoginData() {
  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors
    }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { setStorageData, dataStorage } = useStorageData();

  async function handleRegister(formData: FormData) {

    const newLoginData = {
      id: String(uuid.v4()),
      ...formData
    }

    // Save data on AsyncStorage
    try {

      const dataFormatted = [
        ...dataStorage,
        newLoginData
      ];

      await setStorageData(dataFormatted);

      reset();

      Alert.alert('Registro salvo com sucesso!')

    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar!');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <Container>
        <HeaderTitle>Salve o login de algum serviço!</HeaderTitle>

        <Form>
          <Content
            showsVerticalScrollIndicator={false}
          >
            <Input
              title="Título"
              name="title"
              error={
                // message error here
                errors.title && errors.title.message
              }
              control={control}
              placeholder="Escreva o título aqui"
              autoCapitalize="sentences"
              autoCorrect
            />
            <Input
              title="Email"
              name="email"
              error={
                // message error here
                errors.email && errors.email.message
              }
              control={control}
              placeholder="Escreva o Email aqui"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              title="Senha"
              name="password"
              error={
                // message error here
                errors.password && errors.password.message
              }
              control={control}
              secureTextEntry
              placeholder="Escreva a senha aqui"
            />

            <Button
              style={{
                marginTop: RFValue(26)
              }}
              title="Salvar"
              onPress={handleSubmit(handleRegister)}
            />
          </Content>
        </Form>
      </Container>
    </KeyboardAvoidingView>
  )
}