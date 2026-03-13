'use client';

// =============================================================
// FILE: gallery/_components/gallery-images-tab.tsx
// Gallery Image Management — drag-and-drop reorder, add, edit, delete
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import {
  GripVertical,
  Plus,
  Trash2,
  ImageIcon,
  Save,
  X,
} from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

import type { GalleryImageDto, GalleryImageUpsertPayload } from '@/integrations/shared';
import {
  useListGalleryImagesAdminQuery,
  useCreateGalleryImageAdminMutation,
  useUpdateGalleryImageAdminMutation,
  useDeleteGalleryImageAdminMutation,
  useReorderGalleryImagesAdminMutation,
} from '@/integrations/hooks';

/* ------------------------------------------------------------------ */

const norm = (v: unknown) => String(v ?? '').trim();

function getErrMessage(err: unknown, fallback: string): string {
  const anyErr = err as any;
  return (
    anyErr?.data?.error?.message ||
    anyErr?.data?.message ||
    anyErr?.error ||
    fallback
  );
}

/* ------------------------------------------------------------------ */
/* Sortable image card                                                 */
/* ------------------------------------------------------------------ */

interface SortableImageProps {
  image: GalleryImageDto;
  disabled: boolean;
  onEdit: (img: GalleryImageDto) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

function SortableImageCard({ image, disabled, onEdit, onDelete, t }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const imgUrl = image.image_url_resolved || image.image_url || '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-lg border bg-card p-3"
    >
      <button
        type="button"
        className="mt-1 cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        disabled={disabled}
      >
        <GripVertical className="size-5" />
      </button>

      <div className="size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={image.alt || ''}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">
            {image.alt || image.caption || `#${image.display_order}`}
          </span>
          {!image.is_active ? (
            <Badge variant="secondary" className="text-xs">
              {t('admin.gallery.images.inactive')}
            </Badge>
          ) : null}
        </div>
        {image.caption ? (
          <p className="truncate text-xs text-muted-foreground">{image.caption}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {t('admin.gallery.images.order')}: {image.display_order}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onEdit(image)}
          disabled={disabled}
        >
          <Save className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-destructive"
          onClick={() => onDelete(image.id)}
          disabled={disabled}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Edit image inline form                                              */
/* ------------------------------------------------------------------ */

interface EditFormValues {
  alt: string;
  caption: string;
  is_active: boolean;
}

function ImageEditForm({
  image,
  galleryId,
  locale,
  disabled: parentDisabled,
  onClose,
  t,
}: {
  image: GalleryImageDto;
  galleryId: string;
  locale: string;
  disabled: boolean;
  onClose: () => void;
  t: (key: string) => string;
}) {
  const [values, setValues] = React.useState<EditFormValues>({
    alt: norm(image.alt),
    caption: norm(image.caption),
    is_active: image.is_active === 1,
  });

  const [updateImage, { isLoading }] = useUpdateGalleryImageAdminMutation();
  const disabled = parentDisabled || isLoading;

  async function handleSave() {
    try {
      await updateImage({
        galleryId,
        imageId: image.id,
        patch: {
          locale,
          alt: values.alt || null,
          caption: values.caption || null,
          is_active: values.is_active ? 1 : 0,
        } as GalleryImageUpsertPayload,
      }).unwrap();
      toast.success(t('admin.gallery.images.updated'));
      onClose();
    } catch (err) {
      toast.error(getErrMessage(err, t('admin.gallery.images.updateError')));
    }
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="gap-1 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            {t('admin.gallery.images.editImage')}
          </CardTitle>
          <Button type="button" variant="ghost" size="icon" className="size-7" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">{t('admin.gallery.images.altLabel')}</Label>
            <Input
              value={values.alt}
              onChange={(e) => setValues((p) => ({ ...p, alt: e.target.value }))}
              disabled={disabled}
              placeholder={t('admin.gallery.images.altPlaceholder')}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t('admin.gallery.images.captionLabel')}</Label>
            <Input
              value={values.caption}
              onChange={(e) => setValues((p) => ({ ...p, caption: e.target.value }))}
              disabled={disabled}
              placeholder={t('admin.gallery.images.captionPlaceholder')}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`img_active_${image.id}`}
            checked={values.is_active}
            onCheckedChange={(v) => setValues((p) => ({ ...p, is_active: v === true }))}
            disabled={disabled}
          />
          <Label htmlFor={`img_active_${image.id}`} className="text-xs">
            {t('admin.gallery.images.activeLabel')}
          </Label>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={disabled}>
            {t('admin.gallery.images.cancelButton')}
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={disabled}>
            <Save className="mr-1.5 size-3.5" />
            {t('admin.gallery.images.saveButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Main tab component                                                  */
/* ------------------------------------------------------------------ */

interface GalleryImagesTabProps {
  galleryId: string;
  locale: string;
  disabled?: boolean;
}

export function GalleryImagesTab({ galleryId, locale, disabled: parentDisabled = false }: GalleryImagesTabProps) {
  const t = useAdminT();

  const { data: images, isLoading, isFetching } = useListGalleryImagesAdminQuery(
    { galleryId, locale },
    { skip: !galleryId },
  );

  const [createImage, createState] = useCreateGalleryImageAdminMutation();
  const [deleteImage, deleteState] = useDeleteGalleryImageAdminMutation();
  const [reorderImages, reorderState] = useReorderGalleryImagesAdminMutation();

  const busy =
    isLoading || isFetching || createState.isLoading || deleteState.isLoading || reorderState.isLoading;
  const disabled = parentDisabled || busy;

  const [editingImage, setEditingImage] = React.useState<GalleryImageDto | null>(null);
  const [orderedIds, setOrderedIds] = React.useState<string[]>([]);

  const sortedImages = React.useMemo(() => {
    const list = Array.isArray(images) ? [...images] : [];
    list.sort((a, b) => a.display_order - b.display_order);
    return list;
  }, [images]);

  React.useEffect(() => {
    setOrderedIds(sortedImages.map((i) => i.id));
  }, [sortedImages]);

  const imageMap = React.useMemo(() => {
    const map = new Map<string, GalleryImageDto>();
    for (const img of sortedImages) map.set(img.id, img);
    return map;
  }, [sortedImages]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(orderedIds, oldIndex, newIndex);
    setOrderedIds(newOrder);

    try {
      await reorderImages({ galleryId, ids: newOrder }).unwrap();
      toast.success(t('admin.gallery.images.reordered'));
    } catch (err) {
      toast.error(getErrMessage(err, t('admin.gallery.images.reorderError')));
      setOrderedIds(sortedImages.map((i) => i.id));
    }
  }

  async function handleAddImage(url: string) {
    if (!url) return;
    try {
      await createImage({
        galleryId,
        payload: {
          image_url: url,
          locale,
          display_order: sortedImages.length,
          is_active: 1,
        } as GalleryImageUpsertPayload,
      }).unwrap();
      toast.success(t('admin.gallery.images.added'));
    } catch (err) {
      toast.error(getErrMessage(err, t('admin.gallery.images.addError')));
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm(t('admin.gallery.images.deleteConfirm'))) return;
    try {
      await deleteImage({ galleryId, imageId }).unwrap();
      toast.success(t('admin.gallery.images.deleted'));
      if (editingImage?.id === imageId) setEditingImage(null);
    } catch (err) {
      toast.error(getErrMessage(err, t('admin.gallery.images.deleteError')));
    }
  }

  const imageMetadata = React.useMemo(
    () => ({
      module_key: 'gallery',
      gallery_id: galleryId,
      locale,
    }),
    [galleryId, locale],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add image */}
      <Card>
        <CardHeader className="gap-1 pb-3">
          <CardTitle className="text-sm">{t('admin.gallery.images.addTitle')}</CardTitle>
          <CardDescription className="text-xs">
            {t('admin.gallery.images.addDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminImageUploadField
            label={t('admin.gallery.images.uploadLabel')}
            bucket="public"
            folder="gallery"
            metadata={imageMetadata}
            value=""
            onChange={handleAddImage}
            disabled={disabled}
          />
        </CardContent>
      </Card>

      {/* Editing form */}
      {editingImage ? (
        <ImageEditForm
          image={editingImage}
          galleryId={galleryId}
          locale={locale}
          disabled={parentDisabled}
          onClose={() => setEditingImage(null)}
          t={t}
        />
      ) : null}

      {/* Image list */}
      <Card>
        <CardHeader className="gap-1 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              {t('admin.gallery.images.listTitle')}
            </CardTitle>
            <Badge variant="secondary">{sortedImages.length}</Badge>
          </div>
          <CardDescription className="text-xs">
            {t('admin.gallery.images.listDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedImages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <ImageIcon className="size-8" />
              <p className="text-sm">{t('admin.gallery.images.empty')}</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {orderedIds.map((id) => {
                    const img = imageMap.get(id);
                    if (!img) return null;
                    return (
                      <SortableImageCard
                        key={id}
                        image={img}
                        disabled={disabled}
                        onEdit={setEditingImage}
                        onDelete={handleDelete}
                        t={t}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
