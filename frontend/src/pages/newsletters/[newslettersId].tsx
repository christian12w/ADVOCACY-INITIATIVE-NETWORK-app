import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/newsletters/newslettersSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditNewsletters = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'email': '',

    'status': '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { newsletters } = useAppSelector((state) => state.newsletters)

  const { newslettersId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: newslettersId }))
  }, [newslettersId])

  useEffect(() => {
    if (typeof newsletters === 'object') {
      setInitialValues(newsletters)
    }
  }, [newsletters])

  useEffect(() => {
      if (typeof newsletters === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (newsletters)[el])

          setInitialValues(newInitialVal);
      }
  }, [newsletters])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: newslettersId, data }))
    await router.push('/newsletters/newsletters-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit newsletters')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit newsletters'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="Email"
    >
        <Field
            name="email"
            placeholder="Email"
        />
    </FormField>

    <FormField
        label="Status"
    >
        <Field
            name="status"
            placeholder="Status"
        />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/newsletters/newsletters-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditNewsletters.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditNewsletters
