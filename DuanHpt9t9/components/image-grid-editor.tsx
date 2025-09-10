"use client"

import { useState, useRef } from 'react'
import { useToast } from "@/hooks/use-toast"
import { calculateGridLayout } from "@/utils/grid-calculator"

interface ImageGridEditorProps {
  pageNumber: number
  imagesPerPage: number
  imagesPerRow: number
  images: (string | null)[]
  onImageChange: (slotIndex: number, imageData: string) => void
  readonly?: boolean
}

export default function ImageGridEditor({
  pageNumber,
  imagesPerPage,
  imagesPerRow,
  images,
  onImageChange,
  readonly = false
}: ImageGridEditorProps) {
  const { toast } = useToast()
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [loadingSlots, setLoadingSlots] = useState<Set<number>>(new Set())

  // Sử dụng hàm tính toán thông minh
  const gridCalculation = calculateGridLayout({
    imagesPerPage,
    imagesPerRow
  })

  // Extract calculated values
  const {
    cellWidth: finalCellWidth,
    cellHeight: finalCellHeight,
    rows,
    totalGridWidth,
    totalGridHeight,
    isValid,
    warnings,
    errors
  } = gridCalculation

  const gapSize = 5 // mm
  const availableWidth = 180 // mm - conservative
  const availableHeight = 200 // mm - conservative

  const handleImageSlotClick = async (slotIndex: number) => {
    console.log(`🖼️ Image slot ${slotIndex} clicked on page ${pageNumber}, readonly: ${readonly}`)
    
    if (readonly) {
      console.log(`❌ Cannot click - page is readonly`)
      return
    }
    
    console.log(`✅ Processing click for slot ${slotIndex}`)
    
    // Create file input if not exists
    if (!fileInputRefs.current[slotIndex]) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.style.display = 'none'
      document.body.appendChild(input)
      fileInputRefs.current[slotIndex] = input
    }

    const input = fileInputRefs.current[slotIndex]
    if (!input) return

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      console.log('📁 File selected:', file.name, 'Size:', file.size, 'Type:', file.type)

      // Set loading state
      setLoadingSlots(prev => new Set(prev).add(slotIndex))

      try {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error("Vui lòng chọn file ảnh (JPG, PNG, GIF, etc.)")
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error("File ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 10MB.")
        }

      // CROP ẢNH THÀNH HÌNH VUÔNG TRƯỚC KHI LỮU
      const cropImageToSquare = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject('Cannot create canvas context')
            return
          }
          
          img.onload = () => {
            // Tính kích thước crop (lấy cạnh nhỏ nhất)
            const size = Math.min(img.width, img.height)
            
            // Set canvas thành hình vuông
            canvas.width = size
            canvas.height = size
            
            // Tính vị trí crop để center ảnh
            const cropX = (img.width - size) / 2
            const cropY = (img.height - size) / 2
            
            // Vẽ ảnh đã crop lên canvas
            ctx.drawImage(
              img,
              cropX, cropY, size, size,  // Source crop area
              0, 0, size, size           // Destination area
            )
            
            // Convert thành base64
            const croppedImageData = canvas.toDataURL('image/jpeg', 0.9)
            resolve(croppedImageData)
          }
          
          img.onerror = () => reject('Failed to load image')
          
          // Load ảnh từ file
          const reader = new FileReader()
          reader.onload = (e) => {
            img.src = e.target?.result as string
          }
          reader.readAsDataURL(file)
        })
      }

      // Crop ảnh thành hình vuông trước khi lưu
        // CROP ẢNH THÀNH HÌNH VUÔNG TRƯỚC KHI LỮU
        const croppedImageData = await cropImageToSquare(file)
        console.log('✂️ Image cropped to square, length:', croppedImageData.length)
        
        onImageChange(slotIndex, croppedImageData)
        
        toast({
          title: "✅ Thành công",
          description: `Đã thêm ảnh "${file.name}" (tự động crop thành hình vuông) vào vị trí ${slotIndex + 1}`,
        })
      } catch (error) {
        console.error('❌ Error processing image:', error)
        toast({
          title: "❌ Lỗi",
          description: error instanceof Error ? error.message : "Không thể xử lý ảnh! Vui lòng thử lại.",
          variant: "destructive",
        })
      } finally {
        // Clear loading state
        setLoadingSlots(prev => {
          const newSet = new Set(prev)
          newSet.delete(slotIndex)
          return newSet
        })
      }
    }

    // Trigger file picker
    input.click()
  }

  const renderImageSlot = (slotIndex: number) => {
    const hasImage = images[slotIndex]
    const imageUrl = hasImage || ''
    const isLoading = loadingSlots.has(slotIndex)

    return (
      <div
        key={slotIndex}
        className={`
          relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden image-slot
          ${hasImage ? 'border-4 border-solid border-green-500' : 'border-4 border-dashed border-blue-500'}
          ${!readonly && !isLoading ? 'hover:border-blue-700 hover:scale-105 hover:shadow-lg' : ''}
          ${readonly ? 'cursor-not-allowed opacity-75' : ''}
          ${isLoading ? 'cursor-wait opacity-75' : ''}
        `}
        style={{
          width: `${finalCellWidth}mm`,
          height: `${finalCellHeight}mm`,
          backgroundColor: hasImage ? '#f0f9ff' : '#f8fafc',
          // Ensure print compatibility
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
        onClick={() => !isLoading && handleImageSlotClick(slotIndex)}
        title={
          isLoading 
            ? `Đang xử lý ảnh ${slotIndex + 1}...` 
            : `Click để ${hasImage ? 'thay' : 'thêm'} ảnh ${slotIndex + 1}`
        }
      >
        {isLoading && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-10 screen-only">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {hasImage ? (
          <>
            <img
              src={imageUrl}
              alt={`Ảnh ${slotIndex + 1}`}
              className="w-full h-full object-cover"
              style={{ 
                borderRadius: '4px',
                // Ensure print compatibility
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact',
                colorAdjust: 'exact',
                // Force visibility in print
                display: 'block',
                visibility: 'visible',
                opacity: 1,
              }}
            />
            <div className="absolute top-1 right-1 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded screen-only">
              {isLoading ? 'Đang xử lý...' : 'Click để thay ảnh'}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 screen-only">
            <div className="w-8 h-8 border-2 border-blue-500 rounded flex items-center justify-center text-blue-500 font-bold text-xl mb-2">
              +
            </div>
            <div className="text-sm font-medium">
              {isLoading ? 'Đang xử lý...' : 'Click để thêm ảnh'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Ảnh {slotIndex + 1}</div>
          </div>
        )}
      </div>
    )
  }

  // Nếu có lỗi validation, hiển thị thông báo lỗi
  if (!isValid || errors.length > 0) {
    return (
      <div className="construction-report-page" style={{ height: '297mm', width: '210mm', padding: '20mm' }}>
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">❌ Không thể tạo trang ảnh</h2>
          <div className="text-left bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-700 mb-2">Lỗi:</h3>
            {errors.map((error, index) => (
              <p key={index} className="text-red-600 mb-1">• {error}</p>
            ))}
            
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">📋 Giới hạn cho phép:</h4>
              <ul className="text-blue-600 text-sm">
                <li>• Tối đa <strong>4 khung theo chiều ngang</strong></li>
                <li>• Tối đa <strong>5 khung theo chiều dọc</strong></li>
                <li>• Tổng số ảnh tối đa: <strong>20 ảnh</strong> (4×5)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="construction-report-page" style={{ 
      height: '297mm', 
      width: '210mm',
      margin: '0',
      padding: '0',
      boxSizing: 'border-box',
      overflow: 'hidden' // QUAN TRỌNG: Ngăn tràn trang
    }}>
      {/* Header Section - CHÍNH XÁC 1/5 of page height (59.4mm) */}
      <div className="text-center" style={{ 
        height: '59.4mm', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        padding: '5mm 10mm',
        boxSizing: 'border-box'
      }}>
        <h2 className="text-xl font-bold text-blue-700 mb-2 print-title">Báo cáo thi công</h2>
        <p className="text-gray-600 text-sm mb-2 print-subtitle">Trang {pageNumber}</p>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 print-subtitle">Hình ảnh thi công</h3>
        
        {/* Grid calculation info */}
        <p className="text-gray-500 text-xs print-footer">
          {imagesPerPage} ảnh ({imagesPerRow} ảnh/hàng) - {rows} hàng - Khung: {finalCellWidth}×{finalCellHeight}mm
        </p>
        
        {/* Show warnings */}
        {warnings.length > 0 && (
          <div className="text-yellow-600 text-xs mt-1">
            {warnings.map((warning, index) => (
              <p key={index}>{warning}</p>
            ))}
          </div>
        )}
      </div>

      {/* Image Grid Section - CHÍNH XÁC 4/5 of page height (237.6mm) */}
      <div className="image-grid-container" style={{ 
        height: '237.6mm',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '10mm',
        boxSizing: 'border-box',
        overflow: 'hidden' // QUAN TRỌNG: Ngăn tràn
      }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${imagesPerRow}, ${finalCellWidth}mm)`,
            gridTemplateRows: `repeat(${rows}, ${finalCellHeight}mm)`,
            gap: `${gapSize}mm`,
            width: `${totalGridWidth}mm`,
            height: `${totalGridHeight}mm`,
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
            alignContent: 'center'
          }}
        >
          {Array.from({ length: imagesPerPage }, (_, index) => renderImageSlot(index))}
        </div>
      </div>
    </div>
  )
}