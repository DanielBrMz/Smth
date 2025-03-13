'use client'

import React, { useActionState, useEffect, useState } from 'react'
import LinkButton from '@/components/shared/LinkButton'
import BigButton from '@/components/shared/BigButton'
import errorHandlingToaster from '@/utilities/errorHandlingToaster'
import toast from 'react-hot-toast'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { useRouter } from 'next/navigation'

interface Message {
  value: string
}

export default function Page() {
  //const { email } = usePasswordVerificationStore();
  const [email] = useState('')

  const router = useRouter()

  if (!email) {
    router.push('/endorser/forgotpassword')
  }

  useEffect(() => {
    toast.success(
      'An email has been sent to your email address with instructions on how to reset your password.',
    )
  }, [])

  const displayEmail = email ? email : 'example@provider.com'

  const message = {
    value: '',
  }

  async function onPasswordRecoverSubmit(prevState: Message, formData: FormData): Promise<Message> {
    const formEmail = formData.get('email')
    if (
      typeof formEmail !== 'string' ||
      // Regex for valid emails
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formEmail)
    ) {
      return {
        value: 'Invalid email address',
      }
    }
    try {
      //await forgotPasswordQuery.mutateAsync({ values: { email: formEmail } });
      return {
        value: 'Sucess',
      }
    } catch (err) {
      const error = err as Error
      return {
        value: error.message,
      }
    }
  }
  const resendForgotPasswordEmail = async () => {
    const emailToSend = email // Assuming 'email' is the email state already available
    if (!emailToSend || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailToSend)) {
      toast.error('Invalid email address')
      return
    }

    try {
      //await forgotPasswordQuery.mutateAsync({ values: { email: emailToSend } });
      toast.success(
        'An email has been sent to your email address with instructions on how to reset your password.',
      )
    } catch (err) {
      const error = err as Error
      toast.error(error.message)
    }
  }

  const [state, formAction] = useActionState(onPasswordRecoverSubmit, message)

  useEffect(() => {
    errorHandlingToaster(
      'An email has been sent to your email address with instructions on how to reset your password.',
      true,
    )
  }, [state])

  return (
    <>
      <LoadingScreen />
      <div className="z-50 mt-4 flex w-full max-w-[75.8125rem] flex-col items-start pl-4 md:pl-0">
        <nav className="mt-4 flex h-[5.5rem] w-full">
          <LinkButton text="Back to login" link={'/Signin'} />
        </nav>
      </div>
      {/* Main wrapper */}
      <div className="relative mt-9 flex h-full w-full max-w-[31.25rem] flex-col items-center pt-[4.375rem]">
        {/* Text */}
        <div className="flex h-fit w-full flex-col items-start justify-center pl-1 text-left">
          <span className="pb-1 text-[1.3438rem] font-bold text-white">
            {'We sent you an email to reset your password.'}
          </span>
          <span className="text-[1rem] tracking-wide text-white">
            {`Email sent to ${displayEmail}. Please check your inbox.`}
          </span>
        </div>
        {/* Instructions */}
        <div className="mt-15 flex h-[17.1875rem] w-full flex-col items-start justify-start rounded-[0.5rem] bg-[#1f2545] pt-11 text-left shadow-md shadow-black md:mt-28 md:px-0">
          <ul className="h-full w-full space-y-6 px-4 md:px-10">
            <li className="text-[1.0313rem] text-white">
              {'- Reset email link sent to your provided email.'}
            </li>
            <li className="text-[1.0313rem] text-white">
              {
                "- Once reset, plase login with your updated password. If you didn't recive an email, please click the link below to resend."
              }
            </li>
          </ul>
        </div>
        {/* Link */}
        <form className="flex h-[6.75rem] items-center justify-center" action={formAction}>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            /* // eslint-disable-next-line @typescript-eslint/no-empty-function */
            onChange={() => {}}
            className="hidden"
          />
          <div
            onClick={() => {
              void resendForgotPasswordEmail()
            }}
          >
            <a
              className="text-sm text-white hover:underline disabled:text-gray-500"
              href="#resend"
              onClick={(e) => e.preventDefault()}
            >
              {"Didn't receive an email? Click here to resend"}
            </a>
          </div>
        </form>
        {/* Button */}
        {false && <BigButton text={'Back to login'} linkTo="/Signin" isEnabled={true} />}
      </div>
    </>
  )
}
