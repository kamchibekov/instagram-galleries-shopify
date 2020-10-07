'use strict'
import React, { useCallback, useState } from 'react'
import { Modal, Button, Toast } from '@shopify/polaris'
import { useParams } from 'react-router-dom'

export default function Integration() {
  const [active, setActive] = useState(false)

  const [toastActive, setToastActive] = useState('')

  const [integerting] = useState(false)

  const toggleActive = useCallback(() => setToastActive((toastActive) => !toastActive), [])

  const handleChange = useCallback(() => setActive(!active), [active])

  const { gallery_id } = useParams()

  const toastMarkup = toastActive ? <Toast content={toastActive} onDismiss={toggleActive} duration={4000} /> : null

  /*
    useEffect(() => {

        if (!active) {
            return
        }

        if (!themeOptions) {
            dispatch(getThemes())
            return
        }

        if (!selectedTheme) {
            setselectedTheme(themeOptions[0].value)
            return
        }

        if (!Sections[selectedTheme]) {
            (async () => {
                const sections = await getSections(selectedTheme)
                if (sections.length) {
                    Sections[selectedTheme] = sections
                    setSectionOtions(sections)
                    setselectedSection(sections[0])
                } else {
                    setToastActive('Sections not found')
                }

            })()
        }

        if (integerting) {
            (async () => {
                const integration = await integrate(selectedTheme, selectedSection)
                setToastActive(integration)
                setIntegrating(false)
            })()
        }
    })

    */

  const code = `<div class="nomad-developers__gallery-media container page-width" data-gallery_id="${gallery_id}" ></div>`

  return (
    <div>
      {toastMarkup}
      <Button onClick={handleChange} primary> Integrate </Button>
      <Modal
        open={active}
        onClose={handleChange}
        title="Copy code to where you want to show the gallery"
        primaryAction={{
          content: 'Copy code',
          loading: integerting,
          onAction: () => {
            const copyinput = document.createElement('input')
            copyinput.value = code
            copyinput.select()
            document.execCommand('Copy')
            // setIntegrating(true)
          },
        }}

      >

        <p>{}</p>

        {/*  <Modal.Section>

                    <Select
                        label="Choose theme"
                        options={themeOptions}
                        onChange={themeId => {
                            setselectedTheme(themeId)
                            if (Sections[themeId]) {
                                setSectionOtions(Sections[themeId])
                                setselectedSection(Sections[themeId][0])
                            }
                        }}
                        value={selectedTheme}
                    />

                    <Select
                        label="Choose section to integrate after"
                        options={sectionOptions}
                        onChange={section => setselectedSection(section)}
                        value={selectedSection}
                    />
                </Modal.Section>

                    */}
      </Modal>
    </div>
  )
}
