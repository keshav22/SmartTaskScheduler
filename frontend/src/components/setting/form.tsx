'use client'


import React, { useState, useEffect } from 'react'
import { apiClient } from '@/services/api'
import './setting.css'

type TabType = 'profile'
type FormDataType = Record<string, string | boolean>

interface SettingsFormComponentProps {
    activeTab: TabType
}

export function SettingsFormComponent({
    activeTab,
}: SettingsFormComponentProps) {
    const [formData, setFormData] = useState<FormDataType>({})
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setFormData({})
    }, [activeTab])

    const formConfig: Record<
        TabType,
        { title: string; fields: { name: string; label: string; type: string }[] }
    > = {
        profile: {
            title: 'Profile Details',
            fields: [
                { name: 'name', label: 'Name:', type: 'text' },
                { name: 'daily_free_time', label: 'Free Time', type: 'number' },
                { name: 'session_duration', label: 'Session Duration', type: 'number' },
                { name: 'break_duration', label: 'Break Duration', type: 'number' },
            ],
        },
    }

    const currentForm = formConfig[activeTab]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await apiClient.patch(`/settings/`, {
                data: formData,
            })

            console.log('Settings updated!')
        } catch (err) {
            console.error('Error updating settings:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-wrapper height-full flex items-center justify-center bg-gray-100">
    <div className="container flex flex-col w-full max-w-2xl h-full p-6">
        <h2 className="text-2xl font-semibold mb-6 text-black text-center">
            {currentForm.title}
        </h2>

        <div className='flex-1 flex overflow-y-auto'>
            <form
                className="form flex flex-col flex-1 gap-4 bg-white p-6 rounded-2xl shadow-md w-full"
                onSubmit={handleSubmit}
            >
                {currentForm.fields.map((field, index) => (
                    <div key={index} className=" grid grid-cols-3 items-center gap-4">
                        <label htmlFor={field.name} className="label text-gray-700 font-medium col-span-1">
                            {field.label}
                        </label>

                        {field.type === 'checkbox' ? (
                            <input type="checkbox" className="col-span-2 h-5 w-5" />
                        ) : (
                            <input
                                id={field.name}
                                type={field.type}
                                className="input col-span-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        [field.name]: e.target.value,
                                    }))
                                }
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading}
                    className="submit-button mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    </div>
</div>
    )
}