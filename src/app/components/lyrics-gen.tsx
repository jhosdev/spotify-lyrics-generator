'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { usePalette } from 'react-palette'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Download, Music, Plus, X } from 'lucide-react'
//import html2canvas from 'html2canvas'
import Image from 'next/image'

import { toPng } from 'html-to-image';

type Lyric = {
  original: string
  translation: string
}

export default function LyricsGenerator() {
  const [showTranslation, setShowTranslation] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [useExtractedColors, setUseExtractedColors] = useState(false)
  const [lyrics, setLyrics] = useState<Lyric[]>([
    { original: "You never told me", translation: "Nunca me dijiste" },
    { original: "being rich was so lonely", translation: "que ser rico era tan solitario" },
    { original: "Nobody know me,", translation: "Nadie me conoce," },
    { original: "oh well", translation: "oh bueno" },
  ])
  const [songTitle, setSongTitle] = useState("Small Worlds")
  const [artist, setArtist] = useState("Mac Miller")
  const [outerBackgroundColor, setOuterBackgroundColor] = useState('#0C0A0B')
  const [cardBackgroundColor, setCardBackgroundColor] = useState('#211D1C')
  const [textColor, setTextColor] = useState('#ffffff')
  const [spotifyLogo, setSpotifyLogo] = useState('/spotify-white.png')

  const lyricCardRef = useRef<HTMLDivElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setImage(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const { data } = usePalette(image ?? "")

  useEffect(() => {
    if (useExtractedColors && data) {
      setOuterBackgroundColor(data.muted || '#0C0A0B')
      setCardBackgroundColor(data.lightMuted || '#211D1C')
      // set text color black
      setTextColor('#000000')
      setSpotifyLogo('/spotify-black.png')
      return
    }
    setOuterBackgroundColor('#0C0A0B')
    setCardBackgroundColor('#211D1C')
    setTextColor('#ffffff')
    setSpotifyLogo('/spotify-white.png')
  }, [useExtractedColors, data])

  const handleLyricChange = (index: number, field: 'original' | 'translation', value: string) => {
    const newLyrics = [...lyrics]
    newLyrics[index][field] = value
    setLyrics(newLyrics)
  }

  const addLyric = () => {
    setLyrics([...lyrics, { original: "", translation: "" }])
  }

  const removeLyric = (index: number) => {
    const newLyrics = lyrics.filter((_, i) => i !== index)
    setLyrics(newLyrics)
  }

  const clearImage = () => {
    setImage(null)
    setUseExtractedColors(false)
  }

  /* const downloadLyricCard = async () => {
    if (lyricCardRef.current) {
      const scale = 2 // Increase resolution
      const canvas = await html2canvas(lyricCardRef.current, {
        scale: scale,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('lyric-card-content')
          if (clonedElement) {
            clonedElement.style.transform = 'none'
            clonedElement.style.position = 'static'
          }
        }
      })
      const image = canvas.toDataURL("image/png")
      const link = document.createElement('a')
      link.href = image
      link.download = `${songTitle} - ${artist} lyric card.png`
      link.click()
    }
  } */

  const htmlToImageConvert = () => {
    if (lyricCardRef.current) {
        toPng(lyricCardRef.current, { cacheBust: false })
        .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = `${songTitle} - ${artist} lyric card.png`;
            link.href = dataUrl;
            link.click();
        })
      .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" >
      <Card className="w-full max-w-5xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Spotify Lyrics Generator</h1>
            
          </div>

          <div className="flex flex-row gap-6 h-full">
            <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4">Lyrics Editor</h2>
              <div {...getRootProps()} className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-2" />
                <p>Drag 'n' drop an image here, or click to select an image</p>
              </div>

              {image && (
                <div className="mb-4">
                  {/* <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-2" /> */}
                  <div className="flex items-center justify-between mt-2">
                    <Switch
                      id="color-mode"
                      checked={useExtractedColors}
                      onCheckedChange={setUseExtractedColors}
                    />
                    <Label htmlFor="color-mode">Use Extracted Colors</Label>
                  </div>
                  <Button onClick={clearImage} className="mt-2 w-full">
                    <X className="mr-2 h-4 w-4" /> Clear Image
                  </Button>
                </div>
              )}

              {(data && data.darkMuted) && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Extracted Colors:</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* {data.map((color, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs mt-1">{color}</span>
                      </div>
                    ))} */}
                    {
                        Object.entries(data).map(([key, value]) => (
                            <div key={key} className="flex flex-col items-center">
                              <div
                                className="w-8 h-8 rounded"
                                style={{ backgroundColor: value }}
                              />
                              <span className="text-xs mt-1">{key}</span>
                            </div>
                        ))
                    }
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <h3 className="font-semibold">Color Settings</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="outerBackground">Outer Background:</Label>
                  <Input
                    id="outerBackground"
                    type="color"
                    value={outerBackgroundColor}
                    onChange={(e) => setOuterBackgroundColor(e.target.value)}
                    className="h-10 w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="cardBackground">Card Background:</Label>
                  <Input
                    id="cardBackground"
                    type="color"
                    value={cardBackgroundColor}
                    onChange={(e) => setCardBackgroundColor(e.target.value)}
                    className="h-10 w-20"
                  />
                </div>
                {/* <div className="flex items-center space-x-2">
                  <Label htmlFor="textColor">Text Color:</Label>
                  <Input
                    id="textColor"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-20"
                  />
                </div> */}
                <div className="flex items-center space-x-2">
                  <Label htmlFor="textColor">Text Black/White:</Label>
                  <Switch
                    id="textColor"
                    checked={textColor === '#ffffff'}
                    onCheckedChange={(checked) => {
                        setTextColor(checked ? '#ffffff' : '#000000')
                        setSpotifyLogo(checked ? '/spotify-white.png' : '/spotify-black.png')
                    }}
                  />
                </div>
              </div>

              <h3 className="font-semibold">Song</h3>              

              <div className="mb-4 space-y-2 mt-2">
                <Input
                  placeholder="Song Title"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                />
                <Input
                  placeholder="Artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
              </div>

              <h3 className="font-semibold">Lyrics</h3>

              <div className="flex items-center space-x-2 my-4">
                    <Switch
                        id="translation-mode"
                        checked={showTranslation}
                        onCheckedChange={setShowTranslation}
                    />
                    <Label htmlFor="translation-mode">Enable Lyrics Translation</Label>
                </div>

              <div className="space-y-4 mb-4">
                {lyrics.map((lyric, index) => (
                  <div key={index} className="space-y-2 p-2 border border-gray-300 rounded">
                    <div className="flex space-x-2">
                      <Input
                        placeholder={`Original Lyric ${index + 1}`}
                        value={lyric.original}
                        onChange={(e) => handleLyricChange(index, 'original', e.target.value)}
                      />
                      <Button onClick={() => removeLyric(index)} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {showTranslation && (
                      <Input
                        placeholder={`Translation ${index + 1}`}
                        value={lyric.translation}
                        onChange={(e) => handleLyricChange(index, 'translation', e.target.value)}
                      />
                    )}
                  </div>
                ))}
                <Button onClick={addLyric} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Lyric
                </Button>
              </div>

              <Button onClick={htmlToImageConvert} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Lyric Card
              </Button>
            </div>

            <div className='w-1/2 h-full'>
              <h2 className="text-xl font-semibold mb-4">Lyric Card Preview</h2>
              <div
                className='m-0 py-[60px] px-[20px] h-full w-full'
                style={{ backgroundColor: outerBackgroundColor }}
                ref={lyricCardRef}
              >
                <Card
                  className="border-transparent m-auto max-w-[380px]"
                  style={{ backgroundColor: cardBackgroundColor, color: textColor }}
                >
                  <CardContent id="lyric-card-content" className="py-5 px-8">
                    <div className="flex items-center space-x-3 mt-6 mb-8 h-[52px]">
                      {image ? (
                        <img src={image} alt="Album cover" className="w-10 h-10 rounded" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center">
                          <Music size={32} />
                        </div>
                      )}
                      <div className=''>
                        <h2 className="font-bold text-base">{songTitle}</h2>
                        <p className="text-sm opacity-85">{artist}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {lyrics.map((lyric, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-3xl font-bold">{lyric.original}</p>
                          {showTranslation && (
                            <p className="text-xl opacity-70">{lyric.translation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-[50px] mb-3">
                      <Image src={spotifyLogo} width={110} height={41} alt="Spotify Logo" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}