'use client'


import React, { useState } from 'react'
import { apiClient } from '@/services/api'
import './setting.css'

type TabType = 'profile' | 'focus'
type FormDataType = Record<string, string | boolean>

interface SettingsFormComponentProps {
    activeTab: TabType
}

export function SettingsFormComponent({
    activeTab,
}: SettingsFormComponentProps) {
    const [formData, setFormData] = useState<FormDataType>({})
    const [loading, setLoading] = useState<boolean>(false)

    const formConfig: Record<
        TabType,
        { title: string; fields: {name: string, label: string; type: string }[] }
    > = {
        profile: {
            title: 'Profile Information',
            fields: [
                {name:"name", label: 'Full Name', type: 'text' },
                {name:'email', label: 'Email', type: 'email' },
                {name:'password', label: 'New Password', type: 'password' },
            ],
        },
        focus: {
            title: 'Focus Settings',
            fields: [
                {name:'optA', label: 'Option A', type: 'text' },
                {name:'optB', label: 'Option B', type: 'text' },
            ],
        },
    }

    const currentForm = formConfig[activeTab]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await apiClient.patch(`/settings/${activeTab}`, {
                type: activeTab,
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
        <div className="form-wrapper">
            <div className="container">
                <h2 className="text-xl font-semibold mb-4 text-black">
                    {currentForm.title}
                </h2>

                <form className="form" onSubmit={handleSubmit}>
                    {currentForm.fields.map((field, index) => (
                        <div key={index} className="field">
                            <label className="label">{field.label}</label>

                            {field.type === 'checkbox' ? (
                                <input type="checkbox" />
                            ) : (
                                <input
                                    type={field.type}
                                    className="input"
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
                        className="submit-button"
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </div>
    )
}