'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { profileSchema, type ProfileFormData } from '@/features/profiles/profiles.schema';
import { useProfile, useUpdateProfile } from '@/features/profiles/profiles.action';
import { useUploadFile } from '@/features/storage/storage.action';
import { useChangePassword } from '@/features/auth/auth.action';

const passwordSchema = z
  .object({
    new_password: z.string().min(6),
    confirm_password: z.string().min(6),
  })
  .refine((v) => v.new_password === v.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfileClient() {
  const t = useTranslations('dashboard');
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadFile('uploads');
  const changePassword = useChangePassword();
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      avatar_url: '',
      address_line1: '',
      address_line2: '',
      city: '',
      country: '',
      postal_code: '',
    },
  });
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      avatar_url: profile.avatar_url || '',
      address_line1: profile.address_line1 || '',
      address_line2: profile.address_line2 || '',
      city: profile.city || '',
      country: profile.country || '',
      postal_code: profile.postal_code || '',
    });
    setAvatarPreview(profile.avatar_url || '');
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    setSubmitMessage(null);
    updateProfile.mutate(data, {
      onSuccess: () => setSubmitMessage(t('profile_update_success')),
      onError: () => setSubmitMessage(t('profile_update_error')),
    });
  };

  const onAvatarFileChange = async (file: File | null) => {
    if (!file) return;
    setUploadMessage(null);
    try {
      const cleanName = file.name.replace(/\s+/g, '-');
      const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const uniqueFile = new File([file], `${uid}-${cleanName}`, {
        type: file.type,
        lastModified: file.lastModified,
      });
      const targetFolder = `profiles/${profile?.id || 'me'}`;

      let uploaded;
      try {
        uploaded = await uploadAvatar.mutateAsync({
          file: uniqueFile,
          folder: targetFolder,
        });
      } catch (error: any) {
        // Retry once for duplicate conflicts.
        if (error?.response?.status === 409) {
          const retryUid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
          const retryFile = new File([file], `${retryUid}-${cleanName}`, {
            type: file.type,
            lastModified: file.lastModified,
          });
          uploaded = await uploadAvatar.mutateAsync({
            file: retryFile,
            folder: targetFolder,
          });
        } else {
          throw error;
        }
      }

      const url = uploaded.url || uploaded.asset?.url || '';
      if (!url) {
        setUploadMessage(t('profile_avatar_upload_error'));
        return;
      }

      setValue('avatar_url', url, { shouldDirty: true });
      setAvatarPreview(url);
      updateProfile.mutate(
        { avatar_url: url },
        {
          onSuccess: () => {
            setUploadMessage(t('profile_avatar_upload_success'));
          },
          onError: () => {
            setUploadMessage(t('profile_avatar_upload_error'));
          },
        },
      );
    } catch {
      setUploadMessage(t('profile_avatar_upload_error'));
    }
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    setPasswordMessage(null);
    changePassword.mutate(
      { password: data.new_password },
      {
        onSuccess: () => {
          setPasswordMessage(t('password_change_success'));
          resetPassword();
        },
        onError: () => {
          setPasswordMessage(t('password_change_error'));
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">{t('profile_title')}</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">{t('profile_avatar_section_title')}</h6>
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-3">
            <div
              className="rounded-circle border overflow-hidden bg-light d-flex align-items-center justify-content-center"
              style={{ width: 90, height: 90 }}
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="fa-light fa-user fs-3 text-muted" />
              )}
            </div>
            <div>
              <label className="form-label mb-2 d-block">{t('profile_avatar_file')}</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => void onAvatarFileChange(e.target.files?.[0] || null)}
                disabled={uploadAvatar.isPending}
              />
              {uploadMessage && (
                <small className={`d-block mt-2 ${uploadMessage === t('profile_avatar_upload_error') ? 'text-danger' : 'text-success'}`}>
                  {uploadMessage}
                </small>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">{t('profile_full_name')}</label>
                <Input {...register('full_name')} />
                {errors.full_name && <small className="text-danger">{errors.full_name.message}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">{t('profile_phone')}</label>
                <Input {...register('phone')} />
              </div>

              <div className="col-12">
                <label className="form-label">{t('profile_avatar_url')}</label>
                <Input {...register('avatar_url')} placeholder="https://..." />
                {errors.avatar_url && <small className="text-danger">{errors.avatar_url.message}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">{t('profile_country')}</label>
                <Input {...register('country')} />
              </div>

              <div className="col-md-6">
                <label className="form-label">{t('profile_city')}</label>
                <Input {...register('city')} />
              </div>

              <div className="col-md-6">
                <label className="form-label">{t('profile_postal_code')}</label>
                <Input {...register('postal_code')} />
              </div>

              <div className="col-12">
                <label className="form-label">{t('profile_address_line1')}</label>
                <Input {...register('address_line1')} />
              </div>

              <div className="col-12">
                <label className="form-label">{t('profile_address_line2')}</label>
                <Input {...register('address_line2')} />
              </div>

              {submitMessage && (
                <div className="col-12">
                  <div className={`alert mb-0 ${updateProfile.isError ? 'alert-danger' : 'alert-success'}`}>
                    {submitMessage}
                  </div>
                </div>
              )}

              <div className="col-12">
                <button type="submit" className="solid__btn" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? t('saving') : t('save_changes')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">{t('password_change_title')}</h6>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">{t('password_new')}</label>
                <Input type="password" {...registerPassword('new_password')} />
                {passwordErrors.new_password && (
                  <small className="text-danger">{passwordErrors.new_password.message}</small>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('password_confirm')}</label>
                <Input type="password" {...registerPassword('confirm_password')} />
                {passwordErrors.confirm_password && (
                  <small className="text-danger">{passwordErrors.confirm_password.message}</small>
                )}
              </div>
              {passwordMessage && (
                <div className="col-12">
                  <div className={`alert mb-0 ${changePassword.isError ? 'alert-danger' : 'alert-success'}`}>
                    {passwordMessage}
                  </div>
                </div>
              )}
              <div className="col-12">
                <button type="submit" className="solid__btn" disabled={changePassword.isPending}>
                  {changePassword.isPending ? t('saving') : t('password_change_submit')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
